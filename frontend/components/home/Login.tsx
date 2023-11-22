import { getCsrfToken, signIn } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export const Login = () => {

    const { signMessageAsync } = useSignMessage()
    const { chain } = useNetwork()
    const { address, isConnected } = useAccount()
    const { connectAsync } = useConnect({
        connector: new InjectedConnector(),
    });

    //   const [{ data: connectData }, connect] = useConnect()
    //   const [, signMessage] = useSignMessage()
    //   const [{ data: networkData }] = useNetwork()
    //   const [{ data: accountData }] = useAccount();

    const handleLogin = async () => {
        try {
            if (!isConnected) {
                await connectAsync();
            }
            const callbackUrl = '/protected';
            const message = new SiweMessage({
                domain: window.location.host,
                address: address,
                statement: 'Sign in with Ethereum to the app.',
                uri: window.location.origin,
                version: '1',
                chainId: chain?.id,
                nonce: await getCsrfToken()
            });
            const signature = await signMessageAsync({ message: message.prepareMessage() });
            signIn('credentials', { message: JSON.stringify(message), redirect: false, signature, callbackUrl });
        } catch (error) {
            window.alert(error)
        }
    }

    return (
        <>
            <button
                className='bigrounded bg-sggreen text-sgbodycopy ml-[11vw]'
                onClick={(e) => {
                    e.preventDefault()
                    handleLogin()
                }}
            >
                Sign-In with Ethereum
            </button>
        </>

    )
}
