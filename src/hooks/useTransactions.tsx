import { ReactNode, useEffect, useState, createContext, useContext   } from "react";
import { api } from "../services/api";


interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

interface TransactionCreate {
    transaction: Transaction,
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionsProviderProps {
    children: ReactNode;
}

interface TransactionsContextData {
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

export const TransactionsContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
);

export function TransactionsProvider({ children }: TransactionsProviderProps){

    const [ transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        api.get('transactions')
            .then(response => setTransactions(response.data['transactions']))
    }, [])



    async function createTransaction(transactionInput: TransactionInput) {
        const responseData = await (await api.post('/transactions', { ...transactionInput, createdAt: new Date()})).data as unknown as TransactionCreate
        const newTransaction = responseData.transaction;

        setTransactions([
            ...transactions,
            newTransaction,
        ])
    }


    return (
        <TransactionsContext.Provider value={{transactions, createTransaction}}>
           {children}
        </TransactionsContext.Provider>
    )
}

export function UseTransactions(){
    const context = useContext(TransactionsContext);

    return context;
}