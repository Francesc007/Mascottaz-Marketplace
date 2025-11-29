// Script para verificar que las variables de entorno estén disponibles
console.log('\n=== VERIFICACIÓN DE VARIABLES DE ENTORNO ===\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ DEFINIDA' : '❌ NO DEFINIDA');
if (supabaseUrl) {
  console.log('  Valor:', supabaseUrl.substring(0, 30) + '...');
}

console.log('\nNEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ DEFINIDA' : '❌ NO DEFINIDA');
if (supabaseAnonKey) {
  console.log('  Valor:', supabaseAnonKey.substring(0, 30) + '...');
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ ERROR: Variables no están disponibles');
  console.log('\nSOLUCIÓN:');
  console.log('1. Verifica que .env.local existe en la raíz del proyecto');
  console.log('2. Reinicia el servidor Next.js (Ctrl+C y luego npm run dev)');
  console.log('3. Las variables NEXT_PUBLIC_* solo están disponibles en el cliente después del build\n');
  process.exit(1);
} else {
  console.log('\n✅ Todas las variables están definidas correctamente\n');
}









