-- Security and RLS performance fixes for stock movements.
-- Prepared for review; this migration is NOT applied to production by this PR.

ALTER FUNCTION public.record_stock_movement(uuid, text, numeric, text, uuid, text)
  SECURITY INVOKER;

REVOKE EXECUTE ON FUNCTION public.record_stock_movement(uuid, text, numeric, text, uuid, text)
  FROM anon;

GRANT EXECUTE ON FUNCTION public.record_stock_movement(uuid, text, numeric, text, uuid, text)
  TO authenticated;

DROP POLICY IF EXISTS stock_movements_insert_own ON public.stock_movements;
CREATE POLICY stock_movements_insert_own
  ON public.stock_movements
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS stock_movements_select_own ON public.stock_movements;
CREATE POLICY stock_movements_select_own
  ON public.stock_movements
  FOR SELECT
  TO authenticated
  USING (owner_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS stock_movements_update_own ON public.stock_movements;
CREATE POLICY stock_movements_update_own
  ON public.stock_movements
  FOR UPDATE
  TO authenticated
  USING (owner_id = (SELECT auth.uid()))
  WITH CHECK (owner_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS stock_movements_delete_own ON public.stock_movements;
CREATE POLICY stock_movements_delete_own
  ON public.stock_movements
  FOR DELETE
  TO authenticated
  USING (owner_id = (SELECT auth.uid()));

-- Keep exactly one unique owner index on company_settings.
DROP INDEX IF EXISTS public.company_settings_owner_unique;
