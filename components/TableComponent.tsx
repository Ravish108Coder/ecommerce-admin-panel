'use client'
import data from '@/lib/DummyDataNew.json'
// import data from '@/lib/Sample.json'

export let dbdata = data
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import CreateOrderModal from './shared/CreateOrderModal';
import { UserButton } from '@clerk/nextjs';

type ProductType = "Product 1" | "Product 2" | "Product 3"

interface OrderType {
    id: string,
    customer_name: string,
    customer_email: string,
    product: ProductType,
    quantity: number,
    order_value: number
}

interface ProductTypeToPriceMap {
    [key: string]: number;
}

export const ProductTypeToPrice: ProductTypeToPriceMap = {
    "Product 1": 10,
    "Product 2": 20,
    "Product 3": 30,
};


export default function TableComponent() {
    const [filter, setFilter] = useState("")
    const handleFilter = (e: any) => {
        setFilter(e.target.value)
    }

    const [Orders, setOrders] = useState(dbdata)
    const [totalOrderPrice, setTotalOrderPrice] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    let currentOrders = Orders.filter((order: any) => order.customer_name.toLowerCase().includes(filter.toLowerCase())
    || order.customer_email.toLowerCase().includes(filter.toLowerCase())
    || order.product.toLowerCase().includes(filter.toLowerCase()
    )).slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(Orders.length / itemsPerPage);

    const [editableOrder, setEditableOrder] = useState("-1")

    const [toBeUpdatedOrder, setToBeUpdatedOrder] = useState<OrderType | null>(null)

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        let total = 0;
        Orders.forEach(order => {
            total += order.order_value
        })
        setTotalOrderPrice(total);
    }, [Orders])

    const handleDeleteOrder = (orderId: any) => {
        setOrders(Orders.filter(order => order.id !== orderId))
    }

    const handleUpdateOrder = (orderId: any) => {
        console.log(toBeUpdatedOrder)
        if (toBeUpdatedOrder === null) return;
        const newOrder = toBeUpdatedOrder;
        newOrder.quantity = (newOrder?.quantity < 1) ? 1 : newOrder?.quantity
        newOrder.order_value = ProductTypeToPrice[newOrder.product] * newOrder?.quantity
        console.log(typeof newOrder.quantity)
        const newOrders = Orders.map(item => item.id === orderId ? newOrder : item)
        setOrders(newOrders)
        setToBeUpdatedOrder(null)
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target
        const newOrder: any = { ...toBeUpdatedOrder, [name]: value }
        setToBeUpdatedOrder(newOrder)
    }

    return (
        <div>
            <div className='flex flex-col items-start md:flex-row md:justify-between md:items-center mb-3 px-3 gap-3'>
                <div className='flex items-center gap-2'>
                    <UserButton showName afterSignOutUrl='/sign-in' />
                    <span className='bg-blue-500 text-white px-2 py-1 rounded-lg'>Admin</span>
                </div>
                <div className='flex gap-2 flex-1 w-full md:max-w-[600px]'>
                    <Input type="search" placeholder="Search Orders" value={filter} onChange={handleFilter} />
                    <Button variant="outline" onClick={() => setFilter('')}>Reset</Button>
                </div>
                <CreateOrderModal setOrders={setOrders} />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="max-w-[50px] overflow-x-auto">Order Id</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Customer Email</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Delete</TableHead>
                        <TableHead className="text-right">Edit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentOrders.map((order) => (
                        <TableRow key={order.id}>
                            {
                                (order.id === editableOrder) ? (
                                    <>
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell>
                                            <Input minLength={3} type="text" name='customer_name' value={toBeUpdatedOrder?.customer_name || ""} onChange={handleChange} />
                                        </TableCell>
                                        <TableCell>
                                            <Input type="text" name='customer_email' value={toBeUpdatedOrder?.customer_email || ""} onChange={handleChange} />
                                        </TableCell>
                                        <TableCell>
                                            {/* <Input type="text" name='product' value={toBeUpdatedOrder?.product || ""} onChange={handleChange} /> */}
                                            <Select value={toBeUpdatedOrder?.product || "Product 1"} onValueChange={(value: ProductType) => setToBeUpdatedOrder((prev: any) => ({ ...prev, product: value }))}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select Product Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Product Type</SelectLabel>
                                                        <SelectItem value="Product 1">Product 1</SelectItem>
                                                        <SelectItem value="Product 2">Product 2</SelectItem>
                                                        <SelectItem value="Product 3">Product 3</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Input className='min-w-[70px]' type="number" name='quantity' value={toBeUpdatedOrder?.quantity || undefined} onChange={handleChange} min={1} />
                                        </TableCell>
                                        <TableCell>
                                            <TableCell>{toBeUpdatedOrder ? (toBeUpdatedOrder.quantity ? toBeUpdatedOrder.quantity * ProductTypeToPrice[toBeUpdatedOrder.product] : 0) : 0}</TableCell>
                                        </TableCell>
                                        <TableCell>{
                                            <div className='flex justify-center items-center'>
                                                <Trash onClick={() => handleDeleteOrder(order.id)} className='h-4 w-4 cursor-pointer' />
                                            </div>
                                        }</TableCell>
                                        <TableCell className="text-right"><Button type='submit' onClick={() => {
                                            setEditableOrder("-1")
                                            handleUpdateOrder(order.id)
                                        }} variant="default">Update</Button></TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell>{order.customer_name}</TableCell>
                                        <TableCell>{order.customer_email}</TableCell>
                                        <TableCell>{order.product}</TableCell>
                                        <TableCell>{order.quantity}</TableCell>
                                        <TableCell>{order.order_value}</TableCell>
                                        <TableCell className="">{
                                            <div className='flex justify-center items-center'>
                                                <Trash onClick={() => handleDeleteOrder(order.id)} className='h-4 w-4 cursor-pointer' />
                                            </div>
                                        }</TableCell>
                                        <TableCell className="text-right"><Button onClick={() => {
                                            setEditableOrder(order.id)
                                            setToBeUpdatedOrder(order as any)
                                        }} variant="outline">Edit</Button></TableCell>
                                    </>
                                )



                            }
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">$ {totalOrderPrice}.00</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <div className="flex justify-center gap-5 items-center mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className='flex gap-2 items-center'>
                    Page <span className='bg-slate-700 px-2 py-1 rounded-sm text-white'>{currentPage}</span> of <span className='bg-slate-700 px-2 py-1 rounded-sm text-white'>{totalPages}</span>
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
