import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PaymentForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expirationDate">Expiration Date</Label>
          <Input id="expirationDate" placeholder="MM/YY" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input id="cvv" placeholder="123" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="nameOnCard">Name on Card</Label>
        <Input id="nameOnCard" placeholder="John Doe" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="billingCountry">Billing Country</Label>
        <Select>
          <SelectTrigger id="billingCountry">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
