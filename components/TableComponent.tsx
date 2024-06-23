'use client'

// For production
import data from '@/lib/DummyDataNew.json'

// For local development
// import data from '@/lib/Sample.json'

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
import EditOrderModal from './shared/EditOrderModal';

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
    "Product 1": 29,
    "Product 2": 49,
    "Product 3": 149,
};


export default function TableComponent() {
    const [filter, setFilter] = useState("")
    const handleFilter = (e: any) => {
        setFilter(e.target.value)
    }

    const [Orders, setOrders] = useState(data)
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
        setFilter(prev=>prev)
    }, [Orders])

    const handleDeleteOrder = (orderId: any) => {
        setOrders(Orders.filter(order => order.id !== orderId))
    }

    return (
        <div>
            <div className='flex flex-col items-start md:flex-row md:justify-between md:items-center mb-3 px-3 gap-3'>
                <div className='flex items-center gap-2'>
                    <UserButton showName afterSignOutUrl='/sign-in' />
                    <span className='bg-blue-500 text-white px-2 py-1 rounded-lg'>Admin</span>
                </div>
                <div className='flex gap-2 flex-1 w-full md:max-w-[600px]'>
                    <Input type="search" placeholder="Search orders by name, email or product" value={filter} onChange={handleFilter} />
                    <Button variant="outline" onClick={() => setFilter('')}>Reset</Button>
                </div>
                <CreateOrderModal setOrders={setOrders} Orders={Orders} />
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
                            <TableCell className="text-right">
                                <EditOrderModal orderDetails={order} setOrders={setOrders} Orders={Orders} />
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">₹ {totalOrderPrice}.00</TableCell>
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
