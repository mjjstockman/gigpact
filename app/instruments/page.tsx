import { createClient } from '@/lib/supabase/server';

export default async function Instruments() {
  const supabase = await createClient();
  const { data: instruments, error } = await supabase
    .from('instruments')
    .select();

  console.log('Supabase error:', error);
  console.log('Supabase data:', instruments);

  return (
    <div>
      <pre>{JSON.stringify(instruments ?? [], null, 2)}</pre>
    </div>
  );
}
