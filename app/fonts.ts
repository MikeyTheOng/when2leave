import localFont from 'next/font/local'

// Local fonts
export const arialRounded = localFont({
    src: [
        {
            path: './fonts/ARIALROUNDEDMT.woff',
            weight: '400',
            style: 'normal',
        },
        {
            path: './fonts/ARIALROUNDEDMTEXTRABOLD.woff',
            weight: '700',
            style: 'normal',
        },
    ],
    variable: '--font-arial-rounded',
    display: 'swap',
}) 