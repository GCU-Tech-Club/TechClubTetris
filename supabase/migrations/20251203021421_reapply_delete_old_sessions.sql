create extension if not exists "pg_cron" with schema "pg_catalog";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_old_sessions()
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
  delete from public.sessions
  where created_at < now() - interval '24 hours';
END;$function$
;

SELECT cron.schedule('delete-old-sessions', '0 0 * * *', 'SELECT public.delete_old_sessions()');