import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ContactUs = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Contact Us</h1>
      <Card>
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 dark:text-gray-300">Name</label>
              <input type="text" id="name" name="name" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
              <input type="email" id="email" name="email" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1 dark:text-gray-300">Message</label>
              <textarea id="message" name="message" rows="4" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" required></textarea>
            </div>
            <Button type="submit">Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactUs;