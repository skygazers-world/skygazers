import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { RainbowKitProvider, Theme, darkTheme, getDefaultWallets } from '@rainbow-me/rainbowkit';
import merge from 'lodash.merge';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Layout from 'components/shared/layout';

const { chains, provider, webSocketProvider } = configureChains(
  [
    // chain.goerli, 
    chain.localhost
  ],
  [
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

const myTheme = merge(darkTheme(), {
  colors: {
    accentColor: 'white',
    accentColorForeground: '#59342B',
    connectButtonBackground: 'transparent',
    connectButtonText: '#59342B',
  },
  fonts: {
    body: 'GATWICKBOLD',
  },
  shadows: {
    connectButton: 'none',

  }
  
} as Theme);


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Layout>
        <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
