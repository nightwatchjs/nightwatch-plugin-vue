import vue from '@vitejs/plugin-vue';
import nightwatchPlugin from 'vite-plugin-nightwatch';

export default {
  optimizeDeps: {
    include: ['vue']
  },
  plugins: [
    vue(),
    nightwatchPlugin({
      componentType: 'vue'
    })
  ]
};
