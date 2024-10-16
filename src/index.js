// 引入各模块
import {percentAmount, generateSigner, signerIdentity, createSignerFromKeypair} from '@metaplex-foundation/umi'
import {TokenStandard, createAndMint, mplTokenMetadata} from '@metaplex-foundation/mpl-token-metadata'
import {createUmi} from '@metaplex-foundation/umi-bundle-defaults'
import {Keypair} from "@solana/web3.js"
import {readFileSync} from 'fs'

// 连接到 Solana devnet
const umi = createUmi('http://127.0.0.1:8899')
// 使用 id.json 本地的私钥文件，实例化钱包
const keypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(readFileSync('/Users/xukui/.config/solana/id.json', "utf-8"))))
// 获取签名者
const eddsaKeypair = umi.eddsa.createKeypairFromSecretKey(keypair.secretKey);
const signer = createSignerFromKeypair(umi, eddsaKeypair);

// 构建元数据
const metadata = {
    name: "BellsCoin",
    symbol: "Bells",
    uri: "https://white-casual-constrictor-618.mypinata.cloud/ipfs/QmTUW5DQ4bWJrJD7RcJRzEybDV3AMturEBZwx5D7kSb3QQ",
}

// 生成 Mint 签名者
const mint = generateSigner(umi);
console.log(mint.publicKey)
// 使用 use 方法配置 UMI 的签名者和元数据模块
umi.use(signerIdentity(signer)).use(mplTokenMetadata())


// 打包发送 令牌铸造的交易
createAndMint(umi, {
    mint,
    authority: umi.identity,
    name: "BellsCoin",
    symbol: "Bells",
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 9,
    amount: 10000_000000000,
    tokenOwner: signer.publicKey,
    tokenStandard: TokenStandard.Fungible,
}).sendAndConfirm(umi).then(() => {
    console.log("Successfully minted tokens (", mint.publicKey, ")");
})