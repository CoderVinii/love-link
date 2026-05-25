-- Lovelink - public slug para presentes
-- Execute no Supabase SQL Editor antes/depois do deploy desta versao.

begin;

create extension if not exists pgcrypto;

alter table public.presentes
add column if not exists public_slug text;

do $$
declare
  presente_record record;
  novo_slug text;
begin
  for presente_record in
    select id
    from public.presentes
    where public_slug is null or public_slug = ''
  loop
    loop
      novo_slug := 'lv-' || encode(gen_random_bytes(5), 'hex');

      exit when not exists (
        select 1
        from public.presentes
        where public_slug = novo_slug
      );
    end loop;

    update public.presentes
    set public_slug = novo_slug
    where id = presente_record.id;
  end loop;
end $$;

alter table public.presentes
alter column public_slug set not null;

alter table public.presentes
drop constraint if exists presentes_public_slug_format;

alter table public.presentes
add constraint presentes_public_slug_format
check (public_slug ~ '^[a-z0-9-]{8,80}$');

create unique index if not exists presentes_public_slug_key
on public.presentes (public_slug);

commit;

-- Conferencia:
-- select id, public_slug, pago from public.presentes order by id desc limit 10;
