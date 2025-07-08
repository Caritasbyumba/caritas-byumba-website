// test-bcrypt.js
import bcrypt from 'bcrypt';  // or 'bcryptjs'

(async () => {
  try {
    const hash = await bcrypt.hash('test123', 10);
    console.log('✅ bcrypt works! Hash:', hash);
    
    const match = await bcrypt.compare('test123', hash);
    console.log('✅ Password match:', match);
  } catch (err) {
    console.error('❌ bcrypt error:', err.message);
  }
})();