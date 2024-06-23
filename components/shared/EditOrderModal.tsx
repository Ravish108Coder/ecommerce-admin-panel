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
import { ProductTypeToPrice } from "../TableComponent"

interface EditOrderModalProps {
    setOrders: (orders: any) => void;
    orderDetails: any;
    Orders: any;
}

export default function EditOrderModal({ setOrders, orderDetails, Orders }: EditOrderModalProps) {
    // const CreateOrderModal : React.FC() = () => {}
    // export default CreateOrderModal

    const [isOpen, setIsOpen] = useState(false);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: orderDetails.customer_name,
            customerEmail: orderDetails.customer_email,
            productName: orderDetails.product,
            quantity: orderDetails.quantity,

        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)

        const newOrder = {
            id: orderDetails.id,
            customer_name: values.customerName,
            customer_email: values.customerEmail,
            product: values.productName,
            quantity: values.quantity,
            order_value: values.quantity * ProductTypeToPrice[values.productName]
        }

        const newOrders = Orders.map((order: any) => {
            if (order.id === orderDetails.id) {
                return newOrder
            }
            return order
        })
        setOrders(newOrders)

        // Close the modal
        setIsOpen(false)

    }

    return (
        <Dialog open={isOpen} onOpenChange={() => {
            isOpen ? (form.reset(), setIsOpen(false)) : setIsOpen(true)
        }}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Order</DialogTitle>
                    {/* <DialogDescription>
                        Fill in the details to create a new order. Click Create Order when you're done.
                    </DialogDescription> */}
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

                        <Button type="submit">Update</Button>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    );
};