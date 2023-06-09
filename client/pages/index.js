import WrongNetworkMessage from '../components/WrongNetworkMessage'
import ConnectWalletButton from '../components/ConnectWalletButton'
import TodoList from '../components/TodoList'
import TaskAbi from '../../Backend/build/contracts/TaskContract.json'
import { TaskContractAdress } from '../config'
import {ethers} from 'ethers'
import { useEffect, useState } from 'react'

/* 
const tasks = [
  { id: 0, taskText: 'clean', isDeleted: false }, 
  { id: 1, taskText: 'food', isDeleted: false }, 
  { id: 2, taskText: 'water', isDeleted: true }
]
*/

export default function Home() {
  const [correctNetwork, setcorrectNetwork] = useState(false)
const [isUserLoggedIn, setisUserLoggedIn] = useState(false)
const [currentAccount, setcurrentAccount] = useState(' ')
const [input, setinput] = useState('  ')
const [tasks, settasks] = useState([])

useEffect(() => {
  connectWallet()
  getAllTasks()
  
}, [])



  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {

    try {
      const {ethereum}=window
      if(!ethereum)
      {
        console.log("Metamask not found");
        return
      }
      let chainId=await ethereum.request({method:'eth_chainId'})
      console.log('Connected to chain',chainId);
      const sepoliaChainId=11155111
      if(chainId != sepoliaChainId)
      { 
        alert('not connected to sepolia...network')
        setcorrectNetwork(false)
        return
      }else{
        setcorrectNetwork(true)
      }
      const accounts=await ethereum.request({method:'eth_requestAccounts'})
      console.log('found accounts',accounts);
      setisUserLoggedIn(true)
      setcurrentAccount(accounts[0])
      console.log(currentAccount);
      
    } catch (error){
      console.log(error);
      
    }

  }

  // Just gets all the tasks from the contract
  const getAllTasks = async () => {
    try {
      const {ethereum}=window
      if(ethereum)
      {
        const provider=new ethers.providers.Web3Provider(ethereum)
        const signer=provider.getSigner()
        const TaskContract=new ethers.Contract(
          TaskContractAdress,
          TaskAbi.abi,
          signer
        )
        let allTask=await TaskContract.getMyTasks()
        settasks(allTask)
      }

      
    } catch (error) {
      console.log(error);
      
    }

  }

  // Add tasks from front-end onto the blockchain
  const addTask = async e => {
    e.preventDefault()
    let task ={
      taskText:input,
      isDeleted:false,
    }

    try {
      const {ethereum}=window
      if(ethereum)
      {
        const provider=new ethers.providers.Web3Provider(ethereum)
        const signer=provider.getSigner()
        const TaskContract=new ethers.Contract(
          TaskContractAdress,
          TaskAbi.abi,
          signer
        )
        TaskContract.addTask(task.taskText,task.isDeleted).then(res=>{
          settasks([...tasks,task])
          console.log('Task added');

        })
      }else{
        console.log("Ethereum obj not exist");
      }
      
    } catch (error) {
      console.log(error);
      
    }
    setinput('')

  }

  // Remove tasks from front-end by filtering it out on our "back-end" / blockchain smart contract
  const deleteTask = key => async () => {
    try {
      const {ethereum}=window
      if(ethereum)
      {
        const provider=new ethers.providers.Web3Provider(ethereum)
        const signer=provider.getSigner()
        const TaskContract=new ethers.Contract(
          TaskContractAdress,
          TaskAbi.abi,
          signer
        )
       const deleteTaskTx= await TaskContract.deleteTask(key,true)
        console.log("Deleted successfully"); 
        let allTasks=await TaskContract.getMyTasks()
        settasks(allTasks)
      }
      else{
        console.log("not exist");
      }
      
    } catch (error) {
      console.log(error);
      
    }

  }

  return (
    <div className='bg-[#97b5fe] h-screen w-screen flex justify-center py-6'>
      {!isUserLoggedIn ? <ConnectWalletButton  connectWallet={connectWallet}/>:
        correctNetwork ? <TodoList tasks={tasks} nput={input} setinput={setinput} addTask={addTask} deleteTask={deleteTask}/> : <WrongNetworkMessage />}
    </div>
  )
}

