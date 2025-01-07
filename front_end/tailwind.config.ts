module.exports = {
	content: [
	  "./app/**/*.{js,ts,jsx,tsx}",
	  "./pages/**/*.{js,ts,jsx,tsx}",
	  "./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
	  extend: {
		colors: {
		  primary: {
			DEFAULT: '#3b82f6',
			dark: '#2563eb',
		  },
		  secondary: {
			DEFAULT: '#10b981',
			dark: '#059669',
		  },
		  accent: {
			DEFAULT: '#f59e0b',
			dark: '#d97706',
		  },
		  background: '#f3f4f6',
		  foreground: '#1f2937',
		  muted: {
			DEFAULT: '#9ca3af',
			dark: '#6b7280',
		  },
		  border: '#e5e7eb',
		},
	  },
	},
	plugins: [],
  }
  
  