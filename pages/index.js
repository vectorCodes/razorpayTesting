import {
  Box,
  Button,
  Center,
  chakra,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useRef } from "react";
import useRazorpay from "react-razorpay";
import axios from "axios";
export default function Home() {
  const inputRef = useRef(null);
  const toast = useToast();
  const Razorpay = useRazorpay();
  const pay = () => {
    const payment = inputRef.current.value;
    axios
      .post("/api/razorpay", {
        payment,
      })
      .then(({ data }) => {
        if (data.err) {
          toast({
            title: "Error",
            description: `${data.err}`,
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_KEY_KEY_ID, // Enter the Key ID generated from the Dashboard
          amount: data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "Acme Corp",
          description: "Test Transaction",
          image: "https://example.com/your_logo",
          order_id: data.id, //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
          handler: function (response) {
            toast({
              title: "Payment Successfull",
              description: `${response.razorpay_signature}`,
              status: "success",
              duration: 4000,
              isClosable: true,
            });
          },
          prefill: {
            name: "Piyush Garg",
            email: "piyushgarg.dev@gmail.com",
            contact: "9999999999",
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp1 = new Razorpay(options);

        rzp1.on("payment.failed", function (response) {
          toast({
            title: "Error",
            description: `${response.error.description}`,
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        });

        rzp1.open();
      });
  };
  return (
    <Box p={24}>
      <Box
        m={"0 auto"}
        maxW={"3xl"}
        p={8}
        bgGradient={"linear(to-r,green.500,green.800)"}
        rounded={"xl"}
      >
        <Center>
          <Heading textColor={"white"}>Razorpay Payment</Heading>
        </Center>
        <Box mt={8}>
          <chakra.span fontWeight={"bold"} px={8}>
            Enter Amount
          </chakra.span>
          <Input ref={inputRef} type="number" placeholder="1000" w={"60%"} />
        </Box>
        <Box mt={4}>
          <Center>
            <Button colorScheme={"blue"} onClick={pay}>
              Pay with Razorpay
            </Button>
          </Center>
        </Box>
      </Box>
    </Box>
  );
}
