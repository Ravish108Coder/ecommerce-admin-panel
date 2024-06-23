"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
    customerName: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }),
    customerEmail: z.string().email({
        message: "Please enter a valid email address.",
    }),
    productName: z.string().min(1, {
        message: "Please select a product.",
    }),
    quantity: z.number().min(1, {
        message: "Quantity must be at least 1.",
    }),
})

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

import React, { use, useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ProductTypeToPrice, dbdata } from "../TableComponent"

interface CreateOrderModalProps {
    setOrders: (orders: any) => void;
}

export default function CreateOrderModal({ setOrders }: CreateOrderModalProps) {
    // const CreateOrderModal : React.FC() = () => {}
    // export default CreateOrderModal

    const [isOpen, setIsOpen] = useState(false);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: "",
            customerEmail: "",
            productName: "",
            quantity: 1,

        },
    })

    function generateObjectId() {
        const timestamp = Math.floor(Date.now() / 1000).toString(16); 
      
        const randomBytes = (length: number) => {
          const characters = '0123456789abcdef';
          let result = '';
          for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * 16));
          }
          return result;
        };
      
        const machineIdentifier = randomBytes(6); 
        const counter = randomBytes(10); 
      
        return timestamp + machineIdentifier + counter;
      }

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)

        const newOrder = {
            id: generateObjectId(),
            customer_name: values.customerName,
            customer_email: values.customerEmail,
            product: values.productName,
            quantity: values.quantity,
            order_value: values.quantity * ProductTypeToPrice[values.productName]
        }

        const newOrders = [...dbdata, newOrder]

        setOrders(newOrders)

        // Close the modal
        setIsOpen(false)
        form.reset()

    }

    return (
        <Dialog open={isOpen} onOpenChange={() => {
            isOpen ? (form.reset(), setIsOpen(false)) : setIsOpen(true)
        }}>
            <DialogTrigger asChild>
                <Button className="w-full md:max-w-[113px]">Create Order</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Order</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new order. Click Create Order when you're done.
                    </DialogDescription>
                </DialogHeader>



                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="customerName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Customer Name</FormLabel>
                                    <FormControl>
                                        <Input autoComplete="off" placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="customerEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Customer Email</FormLabel>
                                    <FormControl>
                                        <Input autoComplete="off" placeholder="john@mail.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="productName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Select {...field} value={field.value} onValueChange={value => field.onChange(value)}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select Product Name" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Product Name</SelectLabel>
                                                    <SelectItem value="Product 1">Product 1</SelectItem>
                                                    <SelectItem value="Product 2">Product 2</SelectItem>
                                                    <SelectItem value="Product 3">Product 3</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? 1}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value, 10);
                                                if (!isNaN(value) && value >= 1) {
                                                    field.onChange(value);
                                                } else {
                                                    field.onChange('');
                                                }
                                            }}
                                            placeholder="Enter Quantity"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Submit</Button>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    );
};