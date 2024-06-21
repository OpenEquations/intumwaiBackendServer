import { ChatOpenAI } from '@langchain/openai';
import {ChatPromptTemplate} from '@langchain/core/prompts';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import {Document} from '@langchain/core/documents';
// import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import {CheerioWebBaseLoader} from "@langchain/community/document_loaders/web/cheerio"


const prompt = ChatPromptTemplate.fromMessages([
    ['system',`
        Answer everything in the language of kinyarwanda.
        Context: {context}
        Question: {input}
        `],
    ["human","{input}"]
])

// const chain = prompt.pipe(model); //instatiate a model

const chain = await createStuffDocumentsChain({
    llm:model,
    prompt, //because this property have same name like "prompt" we ommit one

})

const loader = new CheerioWebBaseLoader("https://python.langchain.com/v0.1/docs/expression_language/");

const docs = await loader.load();
// console.log(docs);

const response = await chain.invoke({
    input:"What LCEL?",
    context: docs,
})

// console.log(await prompt.format({input: "Hello, how are you doing!?"}));

console.log(response);