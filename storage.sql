-- ÜRÜN VE FİRMA LOGOSU İÇİN STORAGE
-- SQL Düzenleyici'de çalıştırın.

insert into storage.buckets (id, name, public)
values ('company-assets','company-assets',true)
on conflict (id) do update set public=true;

drop policy if exists "company_assets_insert_own" on storage.objects;
create policy "company_assets_insert_own"
on storage.objects for insert to authenticated
with check (
  bucket_id='company-assets'
  and (storage.foldername(name))[1]=auth.uid()::text
);

drop policy if exists "company_assets_update_own" on storage.objects;
create policy "company_assets_update_own"
on storage.objects for update to authenticated
using (
  bucket_id='company-assets'
  and (storage.foldername(name))[1]=auth.uid()::text
)
with check (
  bucket_id='company-assets'
  and (storage.foldername(name))[1]=auth.uid()::text
);

drop policy if exists "company_assets_delete_own" on storage.objects;
create policy "company_assets_delete_own"
on storage.objects for delete to authenticated
using (
  bucket_id='company-assets'
  and (storage.foldername(name))[1]=auth.uid()::text
);

drop policy if exists "company_assets_read_public" on storage.objects;
create policy "company_assets_read_public"
on storage.objects for select
to public
using (bucket_id='company-assets');
