import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ContactUs = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows="4" required />
            </div>
            <Button type="submit">Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactUs;