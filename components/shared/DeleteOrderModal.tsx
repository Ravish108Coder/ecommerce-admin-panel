'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash } from "lucide-react"
import { useState } from "react"

interface DeleteOrderModalProps {
    setOrders: (orders: any) => void;
    orderDetails: any;
    Orders: any;
}

export default function DeleteOrderModal({ setOrders, orderDetails, Orders }: DeleteOrderModalProps) {

    const [errors, setErrors] = useState({})
    const [confirmDeleteMsg, setConfirmDeleteMsg] = useState('')
    const [isOpen, setIsOpen] = useState(false);

    let requiredMsg = `delete ${orderDetails.id}`

    const handleDeleteOrder = () => {
        setErrors([])
        if(confirmDeleteMsg !== requiredMsg){
            let tempError = {};
            if(confirmDeleteMsg === ""){
                (tempError as any).confirmDeleteMsg = 'Required'
            }else{
                (tempError as any).confirmDeleteMsg = 'Please type a valid confirm delete message'
            }
            setErrors(tempError)
            return;
        }
        setOrders(Orders.filter((order : any) => order.id !== orderDetails.id))
    }

    const handleChange = (e: any) => {
        setErrors([])
        setConfirmDeleteMsg(e.target.value)
        let currentValue = e.target.value;
        let tempError = {};
        if(currentValue === ""){
            (tempError as any).confirmDeleteMsg = 'Required'
        }else if(currentValue !== requiredMsg){
            (tempError as any).confirmDeleteMsg = 'Please type a valid confirm delete message'
        }
        setErrors(tempError)
    }

  return (
    <Dialog open={isOpen} onOpenChange={() => {
        isOpen ? (setErrors([]), setConfirmDeleteMsg(''),  setIsOpen(false)) : setIsOpen(true)
    }}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Edit Profile</Button> */}
        <Trash className='h-4 w-4 cursor-pointer' />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[455px]">
        <DialogHeader>
          <DialogTitle className="mb-3">Delete Order <span className="bg-teal-100 p-1 rounded-sm">{orderDetails.id}</span></DialogTitle>
          <DialogDescription className="border-2 p-1">
          <pre>{JSON.stringify(orderDetails, null, 2)}</pre>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="space-y-1">
            <Label htmlFor="name" className="w-full font-light">
              Confirm Delete by typing <span className="font-bold">delete {orderDetails.id}</span>
            </Label>
            <Input
              id="confirmDelete"
              autoComplete="off"
              value={confirmDeleteMsg || ""}
              onChange={handleChange}
              placeholder="e.g. delete [orderId]"
              className="col-span-3"
            />
            {errors && (errors as any).confirmDeleteMsg && <span className="text-red-500 text-sm">{(errors as any).confirmDeleteMsg}</span>}
          </div>
        </div>
        <DialogFooter>
          <Button disabled={confirmDeleteMsg !== requiredMsg} variant="destructive" onClick={handleDeleteOrder} type="button">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
