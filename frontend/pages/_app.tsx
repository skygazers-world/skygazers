import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
// import { localhost, goerli, mainnet } from '@wagmi/core/chains';
import * as chainConfigs from '@wagmi/core/chains';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
// import merge from 'lodash.merge';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura'
import Layout from 'components/shared/layout';
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"



const { chains, provider, webSocketProvider } = configureChains(
  [
    chainConfigs[process.env.NEXT_PUBLIC_CHAIN]
  ],
  [
    // alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'SkyGazers',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

// const myTheme = merge(darkTheme(), {
//   colors: {
//     accentColor: 'white',
//     accentColorForeground: '#59342B',
//     connectButtonBackground: 'transparent',
//     connectButtonText: '#59342B',
//   },
//   fonts: {
//     body: 'GATWICKBOLD',
//   },
//   shadows: {
//     connectButton: 'none',

//   }

// } as Theme);


function MyApp({ Component, pageProps }: AppProps<{
  session: Session;
}>) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
