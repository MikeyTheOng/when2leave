import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontSize: {
				base: ["16px", "20px"],
				p: ["16px", "20px"],
				h1: ["40px", "48px"],
				h2: ["32px", "38px"],
				h3: ["16px", "19px"],
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary-700) / <alpha-value>)",
					foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
					50: 'hsl(var(--primary-50) / <alpha-value>)',
					100: 'hsl(var(--primary-100) / <alpha-value>)',
					200: 'hsl(var(--primary-200) / <alpha-value>)',
					300: 'hsl(var(--primary-300) / <alpha-value>)',
					400: 'hsl(var(--primary-400) / <alpha-value>)',
					500: 'hsl(var(--primary-500) / <alpha-value>)',
					600: 'hsl(var(--primary-600) / <alpha-value>)',
					700: 'hsl(var(--primary-700) / <alpha-value>)',
					800: 'hsl(var(--primary-800) / <alpha-value>)',
					900: 'hsl(var(--primary-900) / <alpha-value>)',
					950: 'hsl(var(--primary-950) / <alpha-value>)',
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary-700) / <alpha-value>)",
					foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
					50: 'hsl(var(--secondary-50) / <alpha-value>)',
					100: 'hsl(var(--secondary-100) / <alpha-value>)',
					200: 'hsl(var(--secondary-200) / <alpha-value>)',
					300: 'hsl(var(--secondary-300) / <alpha-value>)',
					400: 'hsl(var(--secondary-400) / <alpha-value>)',
					500: 'hsl(var(--secondary-500) / <alpha-value>)',
					600: 'hsl(var(--secondary-600) / <alpha-value>)',
					700: 'hsl(var(--secondary-700) / <alpha-value>)',
					800: 'hsl(var(--secondary-800) / <alpha-value>)',
					900: 'hsl(var(--secondary-900) / <alpha-value>)',
					950: 'hsl(var(--secondary-950) / <alpha-value>)',
				},
				tertiary: {
					DEFAULT: 'hsl(var(--tertiary-700) / <alpha-value>)',
					50: 'hsl(var(--tertiary-50) / <alpha-value>)',
					100: 'hsl(var(--tertiary-100) / <alpha-value>)',
					200: 'hsl(var(--tertiary-200) / <alpha-value>)',
					300: 'hsl(var(--tertiary-300) / <alpha-value>)',
					400: 'hsl(var(--tertiary-400) / <alpha-value>)',
					500: 'hsl(var(--tertiary-500) / <alpha-value>)',
					600: 'hsl(var(--tertiary-600) / <alpha-value>)',
					700: 'hsl(var(--tertiary-700) / <alpha-value>)',
					800: 'hsl(var(--tertiary-800) / <alpha-value>)',
					900: 'hsl(var(--tertiary-900) / <alpha-value>)',
					950: 'hsl(var(--tertiary-950) / <alpha-value>)',
				},
				success: {
					DEFAULT: 'hsl(var(--success-700) / <alpha-value>)',
					50: 'hsl(var(--success-50) / <alpha-value>)',
					100: 'hsl(var(--success-100) / <alpha-value>)',
					200: 'hsl(var(--success-200) / <alpha-value>)',
					300: 'hsl(var(--success-300) / <alpha-value>)',
					400: 'hsl(var(--success-400) / <alpha-value>)',
					500: 'hsl(var(--success-500) / <alpha-value>)',
					600: 'hsl(var(--success-600) / <alpha-value>)',
					700: 'hsl(var(--success-700) / <alpha-value>)',
					800: 'hsl(var(--success-800) / <alpha-value>)',
					900: 'hsl(var(--success-900) / <alpha-value>)',
					950: 'hsl(var(--success-950) / <alpha-value>)',
				},
				warning: {
					DEFAULT: 'hsl(var(--warning-700) / <alpha-value>)',
					50: 'hsl(var(--warning-50) / <alpha-value>)',
					100: 'hsl(var(--warning-100) / <alpha-value>)',
					200: 'hsl(var(--warning-200) / <alpha-value>)',
					300: 'hsl(var(--warning-300) / <alpha-value>)',
					400: 'hsl(var(--warning-400) / <alpha-value>)',
					500: 'hsl(var(--warning-500) / <alpha-value>)',
					600: 'hsl(var(--warning-600) / <alpha-value>)',
					700: 'hsl(var(--warning-700) / <alpha-value>)',
					800: 'hsl(var(--warning-800) / <alpha-value>)',
					900: 'hsl(var(--warning-900) / <alpha-value>)',
					950: 'hsl(var(--warning-950) / <alpha-value>)',
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive-700) / <alpha-value>)",
					50: 'hsl(var(--destructive-50) / <alpha-value>)',
					100: 'hsl(var(--destructive-100) / <alpha-value>)',
					200: 'hsl(var(--destructive-200) / <alpha-value>)',
					300: 'hsl(var(--destructive-300) / <alpha-value>)',
					400: 'hsl(var(--destructive-400) / <alpha-value>)',
					500: 'hsl(var(--destructive-500) / <alpha-value>)',
					600: 'hsl(var(--destructive-600) / <alpha-value>)',
					700: 'hsl(var(--destructive-700) / <alpha-value>)',
					800: 'hsl(var(--destructive-800) / <alpha-value>)',
					900: 'hsl(var(--destructive-900) / <alpha-value>)',
					950: 'hsl(var(--destructive-950) / <alpha-value>)',
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				rounded: ['var(--font-arial-rounded)'],
			},
		}
	},
	plugins: [animate],
} satisfies Config;
