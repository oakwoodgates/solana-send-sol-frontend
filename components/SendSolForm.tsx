import { FC, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js'

import styles from '../styles/Home.module.css'


export const SendSolForm: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [txSig, setTxSig] = useState('');

    const sendSol = event => {
        event.preventDefault()
        if (!connection || !publicKey) { return }

        try {
            const transaction = new web3.Transaction()
            const recipientPubKey = new web3.PublicKey(event.target.recipient.value)
    
            const instruction = web3.SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: recipientPubKey,
                lamports: web3.LAMPORTS_PER_SOL * event.target.amount.value
            })
    
            transaction.add(instruction)
            sendTransaction(transaction, connection).then(sig => {
                setTxSig(sig)
            })
        } catch (error) {
            alert(error)
        }

        console.log(`Send ${event.target.amount.value} SOL to ${event.target.recipient.value}`)
    }

    return (
        <div>
            <form onSubmit={sendSol} className={styles.form}>
                <label htmlFor="amount">Amount (in SOL) to send:</label>
                <input id="amount" type="text" className={styles.formField} placeholder="e.g. 0.1" required />
                <br />
                <label htmlFor="recipient">Send SOL to:</label>
                <input id="recipient" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                <button type="submit" className={styles.formButton}>Send</button>
            </form>
        </div>
    )
}