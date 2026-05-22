-- Lovelink - hardening minimo de RLS e Storage
-- Execute no Supabase SQL Editor depois do deploy do codigo.

begin;

-- 1) Ativa RLS nas tabelas sensiveis.
alter table public.presentes enable row level security;
alter table public.pagamentos enable row level security;

-- 2) Remove policies publicas anteriores nessas tabelas.
-- A aplicacao agora acessa essas tabelas via API/server-side com service role.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('presentes', 'pagamentos')
  loop
    execute format(
      'drop policy if exists %I on public.%I',
      policy_record.policyname,
      policy_record.tablename
    );
  end loop;
end $$;

-- 3) Revoke explicito para evitar acesso direto por anon/authenticated.
-- Service role continua funcionando porque bypassa RLS.
revoke all on table public.presentes from anon, authenticated;
revoke all on table public.pagamentos from anon, authenticated;

do $$
begin
  if to_regclass('public.presentes_id_seq') is not null then
    revoke all on sequence public.presentes_id_seq from anon, authenticated;
  end if;

  if to_regclass('public.pagamentos_id_seq') is not null then
    revoke all on sequence public.pagamentos_id_seq from anon, authenticated;
  end if;
end $$;

-- 4) Mantem o bucket fotos publico para nao quebrar as URLs ja salvas em presentes.fotos_urls.
-- Public download por URL continua funcionando.
update storage.buckets
set public = true
where id = 'fotos';

-- 5) Remove policies anon/authenticated de listagem/leitura via API do Storage para o bucket fotos.
-- Isso reduz o alerta de listagem publica sem alterar as public URLs dos objetos.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and cmd in ('SELECT', 'ALL')
      and (
        qual ilike '%bucket_id%fotos%'
        or qual ilike '%fotos%bucket_id%'
      )
  loop
    execute format('drop policy if exists %I on storage.objects', policy_record.policyname);
  end loop;
end $$;

commit;

-- Conferencia rapida:
-- select schemaname, tablename, rowsecurity from pg_tables where schemaname = 'public' and tablename in ('presentes', 'pagamentos');
-- select * from pg_policies where schemaname = 'public' and tablename in ('presentes', 'pagamentos');
-- select id, public from storage.buckets where id = 'fotos';
-- select policyname, cmd, roles, qual from pg_policies where schemaname = 'storage' and tablename = 'objects';
