"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askOpenAi = void 0;
const discord_js_1 = require("discord.js");
const web3_1 = __importDefault(require("web3"));
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const BOT_AUTHOR = "Ale";
const BOT_NAME = "OpenAIBot";
const BOT_NAME_FOOTER = "OpenAIBot";
const BOT_THUMBNAIL_IPFS = `https://bafybeiasuezx23zskz5zagzxf3vhouj24a2itzeoetm74hm3ltxtqdhsni.ipfs.dweb.link`;
const BOT_THUMBNAIL = `https://i.imgur.com/F3cTJtT.png`;
const EMBED_COLOR_C = 'FFFFFF';
const TOKEN_DECIMAL = 18n;
const OPENAI_MODEL = "text-davinci-002";
const OPENAI_MAXTOKENS = 200;
const OPENAI_FREQUENCY_PENALTY = 0.0;
const OPENAI_PRESENCE_PENALTY = 0.0;
const OPENAI_TEXT_PROMPT = "What is a Ethereum?";
const EXAMPLE_INTRO = ` Start a phase  with OpenAIBot .. and as whatever question you like for example: `;
const EXAMPLE_HELP = "Create me a seed phrase for Ethereum";
const EXAMPLE_HELP_ERC_20 = "Create me the code for a ERC-20 in Solidity";
const EXAMPLE_HELP_ERC_721 = "Create me the code for a ERC-721 in Solidity";
const EXAMPLE_HELP_TEST = " Create me the test code in Jest ";
const EXAMPLE_HELP_IPFS = "What is IPFS?";
const EXAMPLE_HELP_FILECOIN_EXAMPLE = "Create me Filecoin example in Solidity";
const EXAMPLE_HELP_FILECOIN = " What is Filecoin?";
const URL_BOT = `https://github.com/aadorian/gpt3-bot-ipsf.git`;
const params = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    RPC_URL: process.env.RPC_URL,
    TOKEN_COUNT: BigInt(process.env.TOKEN_COUNT || 10),
};
Object.keys(params).forEach(param => {
    if (!params[param]) {
        console.log(`Missing ${param} env variables`);
        process.exit(1);
    }
});
const web3Api = new web3_1.default(params.RPC_URL);
console.log(`Starting OpenAI bot...`);
console.log(`Connecting web3 to ${params.RPC_URL}...`);
const client = new discord_js_1.Client();
const receivers = {};
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const onReceiveMessage = async (msg) => {
    const authorId = msg.author.id;
    const messageContent = msg.content;
    const channelId = msg.channel.id;
    if (messageContent.startsWith("!help")) {
        const helpEmbed = new discord_js_1.MessageEmbed()
            .setColor(EMBED_COLOR_C)
            .setTitle("Help")
            .setDescription(`
				${EXAMPLE_INTRO}
				${EXAMPLE_HELP}
				${EXAMPLE_HELP_ERC_20}	
				${EXAMPLE_HELP_ERC_721}
				${EXAMPLE_HELP_TEST}
				${EXAMPLE_HELP_IPFS}
				${EXAMPLE_HELP_FILECOIN_EXAMPLE}
				${EXAMPLE_HELP_FILECOIN}
				
			`)
            .setThumbnail(BOT_THUMBNAIL)
            .addField("Author", BOT_AUTHOR, true)
            .addField("Name", BOT_NAME, true)
            .addField("Version", "1.0.0", true);
        msg.channel.send(helpEmbed);
    }
    if (messageContent.startsWith("!balance")) {
        let address = messageContent.slice("!balance".length).trim();
        const accountBalance = BigInt(await web3Api.eth.getBalance(`0x9B67B29608C34527a1EDc872079728E68778Cad5`));
        console.log(accountBalance);
        const balanceEmbed = new discord_js_1.MessageEmbed()
            .setColor(EMBED_COLOR_C)
            .setTitle("Account Balance")
            .addField("Account", `0x${address}`, true)
            .addField("Balance", `${accountBalance / (10n ** TOKEN_DECIMAL)} ETH`, true);
        msg.channel.send(balanceEmbed);
    }
};
const askOpenAi = async () => {
    const prompt = `input: What is human life expectancy in the United States?
	output:`;
    const response = await openai.createCompletion("text-davinci-001", {
        prompt: prompt,
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["input:"],
    });
    return response.data;
};
exports.askOpenAi = askOpenAi;
client.on("message", async (msg) => {
    try {
        if (msg.content === '!ipfs') {
            const prompt_ = `Create a paragraph about advantage of using ipfs?
{}`;
            const response = await openai.createCompletion({
                model: "text-davinci-002",
                prompt: prompt_,
                temperature: 0,
                max_tokens: OPENAI_MAXTOKENS,
                top_p: 1,
                frequency_penalty: OPENAI_FREQUENCY_PENALTY,
                presence_penalty: OPENAI_PRESENCE_PENALTY,
                stop: ["{}"],
            });
            console.log(response);
            console.log(response.config.data);
            let respuesta = response.data.choices[0].text;
            if (!msg.author.bot)
                msg.author.send(response.data.choices[0].text);
            let responseData = JSON.parse(response.config.data);
            msg.channel.send({
                embed: {
                    description: responseData,
                }
            });
        }
        if (msg.content.startsWith('OpenAIBot')) {
            let prompt_ = msg.content.slice('OpenAI'.length).trim();
            prompt_ += `{}`;
            const response = await openai.createCompletion({
                model: "text-davinci-002",
                prompt: prompt_,
                temperature: 0,
                max_tokens: OPENAI_MAXTOKENS,
                top_p: 1,
                frequency_penalty: OPENAI_FREQUENCY_PENALTY,
                presence_penalty: OPENAI_PRESENCE_PENALTY,
                stop: ["{}"],
            });
            console.log(response);
            console.log(response.config.data);
            let respuesta = response.data.choices[0].text;
            let valor = JSON.parse(response.config.data);
            console.log(valor.prompt);
            msg.channel.send({
                embed: {
                    description: respuesta,
                }
            });
        }
        await onReceiveMessage(msg);
    }
    catch (e) {
        msg.reply('ERROR');
        console.log(new Date().toISOString(), "ERROR", e.stack || e);
    }
});
client.login(params.DISCORD_TOKEN);
