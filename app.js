import { ChatOpenAI } from '@langchain/openai';
import {ChatPromptTemplate} from '@langchain/core/prompts';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import {Document} from '@langchain/core/documents';
import {createBuss, deleteBuss, getBusses,} from './database.js'
import express from 'express';
import {format} from 'date-fns';
import cors from 'cors';
import {AIMessage, HumanMessage} from "@langchain/core/messages"
import { MessagesPlaceholder } from "@langchain/core/prompts"
import { v2 } from '@google-cloud/translate';
import twilio from 'twilio';



dotenv.config();


const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
const today = new Date();
// const formattedDate = format(today, 'yyyy-MM-dd HH:mm:ss');


// Use the cors middleware with specific origin
// Enable CORS
app.use(cors(), express.json());

//google translator

const translateText = async (text, targetLanguage) => {
    try {
        let [response] = await translate.translate(text, targetLanguage);
        return response;
    } catch (error) {
        console.log(`Error at translateText --> ${error}`);
        return 0;
    }
};

//--------






const prompt = ChatPromptTemplate.fromMessages([
    ['system',`
        Your model name in this context is Intumwa AI. 
        You are able to tell buss transport information related to sits departure time cost and other related info acrose entire Rwanda.
        Be hospitable, charming, and warmly welcoming towards app users.
        Answer everything in the language of kinyarwanda.
        Be mindful on the time and calender.
        Add dates.
        Be specific and hit to the point.
        seats in Kinyarwanda is 'Umwanya' for one seat, 'Imyanya' for many seats, avoid using other Kinyarwanda terms.
        Put emportant information on new line.
        Use simple Kinyarwanda language words.
        Field: buss transportation.
        Country: Rwanda.
        Context: {context}
        Question: {input}
        `],
        new MessagesPlaceholder("chat_history"),
    ["human","{input}"]
])


const chain = await createStuffDocumentsChain({
    llm:model,
    prompt, 

})

const chatHistory = [];

app.post("/chat",async(req,res)=>{
    let formattedDate = format(today, 'yyyy-MM-dd HH:mm:ss');

    const busses = await getBusses();
let documentRender = ``;
busses.forEach((buss) => {
    documentRender += `The current time is ${formattedDate} ${buss.sits} sits remain in ${buss.company}, bus is going from ${buss.from} city to ${buss.to}, departure time is ${buss.departure_time}, the cost of one sit is ${buss.amount}, the date of diparture is ${buss.date}, plate number is ${buss.plate_number}, the bus departure status is ${buss.plate_number}.\n`;
});
//Document
const documentA = new Document({
    pageContent: documentRender,
})
    const query = req.body.query;

    const response = await chain.invoke({
        // input:"Nizihe zijya nyamagabe ?",
        input:query,
        context: [documentA],
        chat_history:chatHistory,
    });
    chatHistory.push(new HumanMessage(query));
    chatHistory.push(new AIMessage(response));
    res.send({"botResponse":response});
    // res.send({"botResponse":query});
});

app.post("/translate",(req,res)=>{
    let text = req.body.text;
    translateText(text, 'en')
    .then((res1) => {
        res.send(res1);
    })
    .catch((err) => {
        console.log(err);
    });
    // res.send();
    // console.log(text);
})

app.post("/create_buss",(req, res) =>{
    const buss = req.body.data;
    // console.log(buss);
    createBuss(buss.sits,buss.company,buss.from,buss.to,buss.departure_time,buss.amount,buss.date,buss.plate_number,buss.buss_status);
    res.send("OK");
})

app.get("/getAllBusses",async (req, res) =>{
    // const busses = getBusses();
    const busses = await getBusses();
    // console.log(busses);
    res.send(busses);

})

app.get("/deleteBuss/:id",async (req, res) =>{
    const id = req.params.id;
    // const busses = getBusses();
    const busses = await deleteBuss(id);

    res.send("OK");

})
app.post("/your_ticket",async (req, res) =>{
    // const id = req.params.id;

   
   client.messages
       .create({
          //crient message logic
       })
       .then(message => console.log(message.sid))


    res.send("OK");

})




app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  });


app.listen(7070,()=>{
    console.log("the server is running on port 7070");
});