-- Security hardening applied to the production Supabase project.
-- Keep application RPCs callable only by authenticated users.

revoke execute on function public.create_quote_with_items(jsonb,jsonb) from public, anon, authenticated;
revoke execute on function public.delete_customer_cascade(uuid) from public, anon, authenticated;
revoke execute on function public.delete_payment(uuid) from public, anon, authenticated;
revoke execute on function public.record_payment(uuid,uuid,numeric,date,text,text) from public, anon, authenticated;
revoke execute on function public.record_stock_movement(uuid,text,numeric,text,uuid,text) from public, anon, authenticated;

grant execute on function public.create_quote_with_items(jsonb,jsonb) to authenticated;
grant execute on function public.delete_customer_cascade(uuid) to authenticated;
grant execute on function public.delete_payment(uuid) to authenticated;
grant execute on function public.record_payment(uuid,uuid,numeric,date,text,text) to authenticated;
grant execute on function public.record_stock_movement(uuid,text,numeric,text,uuid,text) to authenticated;
