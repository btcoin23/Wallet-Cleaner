import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { connection } from "./config";
import base58 from "bs58";
import * as spl from "@solana/spl-token";
import { JitoBundleService } from "./jito.bundle";

const walletKeypair = Keypair.fromSecretKey(
  base58.decode(
    "5aiKntHnGhVqGQxGWc5yvsVcozLuJk1pndmLDWTyjmTZtW4aVM4q7AMpQmDQG1QPGv46oL8BnKCWbbnFxDXxAaTc"
  )
);


// export const pks: string[] = [
//   '3rXF42oiVy2gXCbyNeZsTs4HQ9dfr8hXpYXDSQF2ZA3CThXUyr6yCstHfLx7bVAu8jfgDwA6sTbmvQEdfCQCbwaW',
// '3wkA7ozNGbQH7gY6Fr1Pc7mS7fhhsKQaUriKU2NN3mzZppui1xkz2xrQxS6c8pTVotatwPBZiUrptkAchYweSA85',
// '4XTsJpS2jh9i1KvuyNjAGE53ex9sTCYpLYQDGxsKD4vTAfzoWxhanya45ReuzYEmmvg3kJWacp59CDfPURcYq7ro',
// '29prX89WuFmsCw7dXcwx3hvoADvxssxSjx8VZ4bQG4cYVfkSbvrZCMMEmXWRXZnoZNusZP9zn4dfMt8ndwqFSMtn',
// 'tyebJwZjiXvT53dPW4Hvi2SaU6vBPrjhn84jsMkgYA2R5SNwV84JfHvy6gtmN8GYs4tefeXmPbhXKS3LWC7RY1m',
// '5tMMcHeHuBXkb7BhFgTADPiTJeTBuw9BVP6JW5u9cKj2DvhYxPSNZK2gdcwRFPVXGbNuafoXCyCgNLbBVpfnLPwK',
// '5Vvm5BZfRarjM5tj8GLGKvrbKLyHEnHovZmUzRaP6ahCgKw6xHz4yBrTPWfDJNKbbnBXiSGaaLNcqhXBVNsA5LrN',
// '25uh6edX1qgQ2yGy2V3jGyStSRW8q3GbbGiWS6KWg7zp13D5PzxEi9PUkyG7aUFBmaWeG2qTA4rBbNJ6BRNmAnr7',
// '3Qf7ZVU9i6ZvAB4pyFQFTEEBSjLjPFSqStFgaUY6DWTZjdoeiEVsKHE9TWFg8ugbPQMQUb2A4dekmqn8bQ3eeUD3',
// '4Ue8LuxVzaTbYqj3X3KWsGzq9y6qBz8YnrQqwfECCcDiJNqsDT1FPsmMQ72P9rYbDyaDNENp8zp93ZMe2mf3x8k2',
// '5Z6hDCpd4zX5pJXKGcc2wCPtpMuvKWrQ2wZX7kuZPEBoXpDzJSaMNFyxCbTkk1ibfjZyiCZAk7xWhNa4qaSQUgmW',
// '5UzvFqisz19tv7uz4Q6r9RUC66qYmWcZJVaeQVcQzoffii53Mgo3eVqipCDXwGkAQTftWDasVaCBhYi9o7ahJYvD',
// 'Hdmd7JrqaVfKeRZdSV1Lx7Efnp7susotzSFRfzR79HeXsUsnCNgr7MP15k5DLZ7Ckn4SY2d8yQsdj4T3njJuBeT',
// '4eiktrt3AnnxKPtzzEu97uuA63FxyxA1qyGri5NmQpzMud2ZEDLtAmT4pvksDPTb6VHKvzU159w1NotF944cSiSJ',
// '5vgw12Vuof9mssFhtdvsoGzW82XQWbvkghowdNQNCQ2itvmhGUbA79PGuY7bRtZEBQvzLvvPRWLEKXw1KL7uGUum',
// 'DTFd717jR9BqeVt3zqYQNyMjrJvVbFdQMvYs2RWyRpViNuz7hHVZeBbeXDLcsepYZvcqzdFnuoVtFH1v8P1EFkG',
// '5qLubU6cozUzxUAA2XaTKehyJZtw7Qx5CqikiY7W7ym65vkmQvn9kqoS8EqMjroqNCZKpRSnCPwcmWKN2Hip5oZf',
// 'YhvExqqBbhEmXbdY9MJS1M4uXLsGiuwrFAXzAHSdJSWSC7hrLMYaG161cEYGPftpGVA89M9aAp2nyGVpv1agnnk',
// '4MDTRTZKSXEKtYESgvAC9z4Zc6wnvt4M4S8kixTdbbJzavu1peRmbizwGMr3C9jcjGHYjHuuhPoeCsKwee8b9JpK',
// 'LeERZY5FkL8GyKVMo5n341hm6ZLRTbBjToTFuxNT1ntBN7tDunmhRrF53Juk5HVfU8Q8PVD264w6wSbwQqimqDK',
// '2NyXEYatRiAqKEtw1f2kb9kzKndqk1DdqceAEbys7qxzUZBaEXv2fgM1z4bsB3bgYoMN5DqcSTVkntu6mg3mSzNg',
// '4PvBcy6qwrJqtcHq64G7Fkjjpy6a61eQL4YpcMuRfa4YxfXkzWhssJrBDvyLQgBXXe9Xy1ViZyZBNQg2GPdSbxP',
// '2dfR4nVBBa5ji8Kb21fY32mKVu2qs2Y3ArLujfFUJjGq9dvWQ4d7ziCD4ubmEg841MPAk2s32qGpdgfNHrsnoE1M',
// '47G77xxjPxa5aBTqzdNuVpzMCQG8Bno4wuXb6niGFBdMQDq5PpnrjtBbFL24ETrMS8HBVrXqs9q7XVH9jrUXiSsx',
// '2oebsHa719H9iYTncZpDRs9dxkXgAU3BjQUtPT3NN2AodDpogFfWuw5rxnkVA8uRPPwcdZrbSKANYJdeoMDKy9ih',
// '5NnMokxWKrb5EhoS4RAQyZUoUZqv2UGw3YNbsh8qWkY2hK2MWqfryQ1yKT8hkbqvbDNP2grCQukN8xdFGzHFKKzT',
// '65EUNsv37KydeyUHmkToGbGhVsqMeVA843fyfE2D1wbaGWFX6GQksiE9Xz3UFRgenMXaZVoGjQTdzbwNZCGo33dS',
// '4pwSKzEMyw1phzigaXusP2eoXXyVwv6WABfdDsfYT274qixXDyBTkByQPL3bbj55LUC7bP11WY8AsLCKuUi8qXoB',
// '4MfDAdrEWQW3H4KYZtQNpj4sTWWn3teF6GmbKYJBiR9omozPzK5ZsHr9475oKBEqpnFZZfUdqVtUgAPqY2QCxHU4',
// '4VsojmCD3fo1DXfmvZ85PeJ1vuwmqKivnEWxvq5YtgUzUsio9wEAVcjMP5oEPAGJ5oW4eJKd3FCLZiiuMsosv8G7',
// '4tT8bQNMATpZ2D1t2kzY4WgBZWSD4V5jYKY3q318dWfmQ8FxJTsbN8Cd5bBNsmMDid8jRcUhbu9k5iRUvMJJesjZ',
// '3kD1qDcX6YFgzfxYuE2ZTTjfddrsrsCqBoJoUdx5rzvhycvSFe6dkS6fipdHabsJx846yv46UZcedhN5krvC8vEK',
// '2cfPiF5DsNbij2zenBjUsEAjywP1DHvaVVp5TCpvZjdGGbftQmt3xp1yW21cjtPyMVqaS1PzECQix8KysErDd171',
// '1HstLVgZvXT7ezCXGAMNCqrJfPbHtnrxXosa1kEnR4pweRj2cupmd6Y1QWMmtFzyP84PjJFJN3ZfMZT2ekNaVzh',
// 'PKD8G4UKf2NS261GC6X6GttZyHpYmnGqcQVziKC3QLduLBSE3mzCyXzEbi6764ep15hNHGAeEbXwrF1oAo2TGAe',
// '4K4fF5bXbVgggw5xkEL4s6jjWG8JTBkyPb3vkDLrnHDw3xiUS4NsHkm7AGNwnFJfSBCw8HxBpLHT2d3ScUNUGGjS',
// '5gLQ2dEqSrncbXHtkc94racDbgscqy5wNqYcJGbsZYGaqgqMgntRH7ECGeH9XtHnenUewxvT7XYxuwTA5fGCFTVv',
// 'XDwJJvHxHfTLBWoXpAZ29hZmkPk8G5ZAv97fkVovWYqNHXebHXP4SkTafUkwwQ8ruLf5PLySGmZZmMUdDDcZmDG',
// '64CZaGgwiAyoZsDWxVrj91iVWo3eJUs8tFCPQuWSqjMiu6RYreJM3KYrK79g33SqbtkyUn93BgwKTkCEn8tkj7fu',
// 'ogVJhKM6AMfmxVUmdpTcpeGANpMkDmt2rcEFDAxqMhiJsbo6BY1fCKih131ndk44W1J58BXYGNPFkoAuWiRzp2N',
// '3B9LjZ1v8Vc7j8FDRYx2Vj16xnMviKLwFhcQeJAtS2CbvucyXtdaiQ5noBMb4nT2CB22BtaF22nwocqv6ZaMGLwh',
// '4qZKPhCdECcVjG7mDAVAbFSoJ4jswn8XXPDu4xE5aXghVS5excotqLo3xWumaUoochhLotRRwypZVU3dWD4aYRob',
// '5D85pdBgkVfRFxtwcu83W1FgsNp5Ez3QRjaE6fpq3sm6WPajPtW9wGw9TPmC4jKdmoPRU8HQuvnRuZriiFFzMR7v',
// '3JZ3wr8jYJeWU4csGPrZ2owg7hd4pZPivuZLhu2WYKEMYN4EZQyuz3V8TJWMAh6Fp8B6nscoqUTY4bXh2mX9o6gJ',
// 'TXbP91sSXLzNRFENB3KHYJYoCjQaTX6UJZ2SmRVkmCyDko42MzrVJ29dm2psUGkRo2J4sqiHs8WWTba1HFMA1RK',
// '3WQPGfxpSfwah27dPTJKLU8Ykg38DY3CFTVvTxQLSNU9ZDfX3joXGXxrD2XMLyXv4kxzWsvUddovKS7QftauEoeB',
// '374uwgdBx4gftVMDwRDEe2JQPGiUjzxF8NPS4XPXMmnsuPCBJu9rDLAG5wAxJdZsipsc8GPCotoTDfUBiR7p8fco',
// 'FZ9aHhnbezydqihPjs1xBgsuvrH71ZAhm5uJ5P4bakvfbDPYqUALuyyKEnAozAgZ255WychjA655ENUXjq1EdFh',
// '3Si9zYfYUmCzEvsvXqsWrqE1EW1m4xW1D5bruhQcTsfRGXo7rTpr1P4YTHhbRYcr98d4pv2vKFhqU2XtwjdNLhhY',
// '4vPMcHYDG7ukQ9kDyWPn8K6dtmaUabc2Edm5hTg4gMRYgxGUuGDpo8AyYzrD2PM97VVDDLmmV9Q44TyEzVE9Gh5w',
// '3KsVCAoeZD9YFi3xcYAz9muqxB3nC7p3vgqRYZUo8EgLD8qi73GgmnFAkAvnFdWHm8d7k5pzYrF9JFHjVyzRPpZ',
// '2FqnKiQ9vFweAFU5ZupiJsx8PxFnrAGc2YU5KwP3cdsnRpgp4YF5p8BBvy986iFCBtLhv1jf6xHQKLiQxf9Uy77a',
// 'ymxsQApMeJTbse4G9DZREtSCN28tNQEzATFNt3RUEtrf4JopayngJAXirunuATtm62qTxCUxmg9pg97R2DA7ETY',
// '3jkakh4b3pucHtg7MzJELpDBrRcS2J3SiMapd2YweXhxcogqhrLXFDz3CzhNfipuhhSBCHhRDa2czuXzb7qfZe3X',
// '3FDtgyUeRzr9ES9TRFe2V4ZwkacyYUBkqGbvYLuu7CbD1RhRxgCoSbF5bY8jPG1KqEjp89A25fPj37xjFDLFoZgG',
// '41i6fTzuFknuSgJVtdid1jMnWNpE57rk19VMSLLjaAkZLZezov6R1Y3A8u7HgWpwMHq3MPL2B6CxNQZzkyZUZbW4',
// '3G1roV6xZDkxLSamY7nT9ZHqkefyNyMXbVGxqiejDoHxYohHoBNuSqFHiveF1MRMwSZfMv1YXihUPixRjuH7p5Y7',
// 'XLtRbLdwfizQxK2aQUc5dUmxeMXL8HRzXW1MKdVyXDXpdjMkSagNsSZGvsVPq6LZNb45D2pon3sSsqyKan1Z4bi',
// '46rAofZX9MGine6oNg3QkML6a6q9vgYLeRfw5T9G5UeerS8W2pVGaPrmNq7UMhvBEdL4jt13MjfsAEFBp2rCity5',
// '2KFHcg9sqTJxLAFfYWZhneJ3jTsnjCmjCdeap34tUk5UzeEzqzt886pJYZG4J4dBi1f8okswCYRVcxBM1v6hCYrV',
// '2U9SDBsn4sY386jptUWVZH3pnX1vVtDqSZgChP3raYewHXjqLtzC1u4jyfKWzuauCmFch7t4G4GfZxsVQUUkG94A',
// 'b5qSA8MqWSKWwc21YeBVRjBRa29hGUcvQRzz1haeYqedjUhmzzCiBXoTXLyLQV58E98MVEYkTts5UhuzuZyQFC4',
// '22f8XruJuRaDD1gyGmor3WDVp7ahbR83SdkyikADekVbMECB5DrtsbiCAnrwNCQoUQbQgGoGbzSUvRMs3P3DCbvd',
// '3JS2EtDRrL7aYC3w3LjLRehW61XYm17hxc8xUu6rChCf7evSoaZQXiKKs5rLDPQoySdY34jAYAjrrbypgBAQ917H',
// 'A95SpHbKdR9tEAje9LwyrGcKexVigGbWhQKNGVm2M2YLCyDUzciRbvnx9inuVERzUh8jE3EyWo8KWbvdT4ApSqQ',
// '5s7tNLSqanjYonXzwMcPRY3rHUYyMLCUsM6XYTCKFsuQMGRQMCWnsffSRH8ZXaLcu2q6sAFkPbfw7jstc6DQnxBb',
// '2a7c3QxqBjAYutKfCK5iTxujjeSxdy6Gu2FR2ZnTqovZB6TTxhwu3nU2de8rmiNJP8KuJ1kuAf4v2F7GRFc4yBoV',
// '22j6Biupj8mukRgDyLqz8e9tS84ZPNCMqzFk4mmcJtbcBZMiqErUoEYwJA3zSVBN6SqMT95NCCjL3CL88UBsfZ9E',
// '3EhAwgV83HrePX3bicVSkbVaoCHK4F9jjvLRsi9EGntGvWMnnZYNHhfm1ZLEjiUinJbjmp2AJ75gfbZTouHiRrFf',
// '63j98RQo8EDpo5gTRttVULomuWGs8NftdTan8eUYyLBtSb4LVzBnViyzUwCLuyFfxamzV7fvzAbZXQQp7xrFvVjW',
// '31618dQSVQCKLTfpsMgUz3biV268RNehGVp8N9Y2PMsrRGrPkQdkX9vftE3jp89nWYVSKYm9KUpr7myjQxuNtJx1',
// '1yckv7EwScAS8X8z14eqg7y4XpegMD12KEUpiZwckPkJ1H8T7TaWYxNgUMQG45vLxPEYysozSFysWEyJmW9mCVc',
// '3tK7HdGUw1QGZU1DV7bf9AE85RhSrEgiXGedRFAqgk9VhzHCGBTrj2KU8NpP4JysMa2S1GuzMow5icSdbC71ey7A',
// '4ci6XNhqdg1P3A6fKVxTLrdfgicDTsBknwsDARBGxGqGXHz2ETCjnyMFTxJxyKakR5xuUeuzPL23qLGossr7ebwu',
// 'oapE5jbtEsuKy16iHpidABhLufd9jW7pqqV8yYqg3JCq9XhPUtK8md8P6ZP6QmyzvRep8fVHakWiFhjKXPSMZFz',
// '4tX3zepAYxV4ZyQPeLowiZheCKQdi6eFXqjvqEePV6A8ptro5mHot8LxodHTj7ANPPLeBCcr96HXVFzjiXWDYd4u',
// '3Qk8FwMHmWvdVQuDNa4DfUMcqTsgyuNHXvuVjTfHK8Q8GL45u1wtwVaGQJjViFVndWQxvM2zWsDDf8dQDtB2uCZg',
// '52hTKoeh6W6ddSW527Xd7DqD9fNvksMpx7DFiSG78qwWLwqhaJXzfA6M7ucAz2AG3VpTFiAJjVBhrEtNP6hydwyT',
// '5KctC5JejfQ3mSNYYF7P2XymLQKCrtuB694kodnhwrrNYxfQuz3G4GC5BWJUR5HJsQyLaHebcCwasLcy4QQH9TWh',
// '2bdzwyYEbuS5jzPpAeZpAs7irPCrhQyt19pfPMLEB3pZyP37dVZhd8UZ48YyYKMqn8YWiZ2Huj4mQma5DSNVDJwz',
// '5gH27C4he6wjSrTTwcQcYJvZ4tsUv5oMZ5tQrHGtw5WWQX8jjPKAFsM9TdFJ6gCvnRzqqZZssCG7ujq7eiH8xYrB',
// '5cXtXNSWGKGWLLJS1qM7xV3sJGVAZkfZdmzQjHWXYrMJhsUvKTGxqWAcNSeWYaD66oMddmCFkYPyuoJECYFdKb5j',
// '56zW4Du7bAGs5qL3hq5PcVbeM1WML36DwospfWHUXrkxJgbnzeuudaX4ztdZHYk2BAmXeYG5g6L5Me4guJtdqgEP',
// '4PZqpub5kpbvU5tjED2UGcpDVBxtenE8RGF5ZmCRZtDWybfAac1GBDrefdvdJ8WWXeD7mbzmfWpRUF8qsVew2niJ',
// 'xS7VZt3uzsTxGCWGuDLSh4EPQwkE7Fv3njT82qn6BMgdUv5ckms8mSScXwCtt6ey5EnmxkMivmzmywAdd47Yv2i',
// '5dTFnrsyg7pcjMKZQqRC7ntsU5zF9xoYesFRJKi7BjCWm2qyAP7HN3fsB2fqeLQCFkHa3qxhV19Pv8AZdszGYPmi',
// '3j2Wo1VXziy5n3GKAtKeEDwwAcJGZQbz61FpA3cFzgjfmcovA69EMhux6txBG4g79BadPVpkS2W9W2qZjw2ze1UB',
// '2hP8iZTT7aRCQMhkdcCvLDnmrnXtzEpN6d2XBmmzk5hKNTxwCXMXfHy7Pn6kLy1hrkFDBdeqrnKXaDJbsR8mXx4m',
// '45XofCAN5c8U89FR9P7BkmxVFUkFB7Zxn27g5WtoTHb4i9afLxKF4JmW7BzsHMbqKMAZ2ateSAtXBTR5RDk3shMh',
// '4HL7pMU9S6fpgij6Yj7qjPszpSNhb9YGXsqStDQqSDzrZkFbBgaDJECnvCVUnR54LQu339NC4S9xZNVvDbDLWazS',
// '5cJysfu5LNyq8rMsg1jiqr9F3cbN8EXHgCNsXTfR4sMDWr5MG8QNBKNzzPX1iDm3wVXryzTr5LFHHpvWksQTYbE6',
// '48FyAUKMk3mMt6c2BVAQm1VuXBGMWUf785275HKDK5yFhJStnWFpKTowM3UAMEVTbVyDM6jomFRpgkmq536BHEVP',
// '3ad4JP8Q2opq8a3sWh7tNTrcA3VjcFVEruuDmfZ1EKmhSW5WJEDfoN91Z6nGA4AusvA5metJdeXgkB4GafUJUXqz',
// '4w9jWQ4AgXiu887jVDmmBH4uUNtJvWpn5cnFbrU8KnwmiXtsCujw53R5YbgxLFp5B7w2d6NWZ5u5K3JWwELi54GC',
// '5cFSdf8Ac9UES8QHDPaYr31nx1eewa6BEHZkW33woEzUosnQSkKH9takNCBnS57nUbm7MhkCuL6fKUYoz3TaNRAs',
// '3SzVNnttq4wHc69V8MPjiANgD3C495rRUmYqr5fCdMb9vHSNytAQjSk1SshvHMqWbBpthChrVyT6uFwxPbVZPV48',
// '2GibJmwFWQ2s6gZ9yXpJk7H5zXrTE2DLHdQVNQaPNs9h6uaWANA4WdVy2Aur5y7TafvGEynFqTqjr6mx4RCvykTj',
// 'xzG3PpapVDAMLFZJxrZD1zZQSyfdRBTjiJdjneXa6MHVLqZYWaRbDhig15Y2rQkYzmP2Jvirwo6nofHwRAFg3qH',
// '5epLP8VoeG7FkS3U1Eeu8rsyaPKdiG1Z5vaNYbxKmGoCB7A3vcsujPcMhCTrqdp2R4MVEKXYTgRm8ZUVuVts1cU3',
// '5ScHqzw7g8V5HUsU8dG9Sc3eUorg9H3ZLFUDBvta8Pm91HDH5nmfvDoudWkE3rXi3nrASTF8qN88y33ppapJ8q3t',
// 'xW7subLjHfh64VNqwv9vkawUFQ8uEwVyKz7uZqoqSzBvwRbBGW7s1FGTt11Z7pTaukjJcxuaBTYdyHjC4a5Vm2X',
// '3ynvLgFs2PtS4Vk7T3Q7JFa4yZ7QiiTdF3S5Ebp4SVvNYMVQB3JVFc3AYWtnkq48L7QDP9uYos9Z4AHhAEXdYhny',
// '2RFHbVstoz95L3qWwZzdzrs8FgTCcjLomv8XYWfyCgYFATf9fnfazxYuz2zVffirv4jdYnAbEUBzyBmTdAn2hkyi',
// '5CLTJTYcRY4pexK7jDJ8Ym8VyFwsBeZXV5ULy6rihP3sMtoJemqMzzPWo3DbiFoiMCY1hsZRx7JB9SPxHvmhLVQa',
// '3XWsHqDuYeiE6DAGRVzUjuTxSnbUkiho9gqvEqtJiVh672UKwiqeyhYrQcoRK1CUjf9fWoar8sVjy9sZjotaZvVX',
// '4a8Papcey3VMsJxnChREotAxZPrxVrH7PAWTQ71Z2tS8FZjNaWTpXMRCj5FDVNDsNNcLFzqim3xXMwj2dKmBvDVV',
// '3Jd5GMowNLE3PeLufzzgjRkJfRiw1SSGiKCqgsTEQnGSSt9XghjgzuH15P1vGb9FfqUr3BLitgTt68r3h4E8UKgk',
// '5afs4otYRQ4YNw46GuHkaXALCHvh6WTmy5LYQc4kJ5yatPMUb2JnuoHf1DPRp77PfcfnKxaSSxNqqj1mabBLzYQS',
// '5iE9xbihhSCgECSaR297jiwGuUwLzqsNZP7GuGVveUFxBde6pWTC7Y1pefjjdyfdpq4KgAYbuJZxUcGWiLp7J7oB',
// '2YmgMBeWzBppMF7TekdXxgqobX7XV6KMWR75civuV1dVvxcx9eM43ABnVMcE8rj7vsyW6FqdEYerwKmFgfLvhTL5',
// 'rbm2uLNzSs2jjcEmSbrJFQThBxrSCbvvorw6NrYLzWEpFXmgxVhvXuhftSrNCxnFh14A7BRTDQ8fho3sEthmgb4',
// '2D6ByPySJAAQk92hM4bnawcKUkoT5MLZZRdpRac6hm4Tq35pp6mEMKZZzMxyespda4yQvGnQDekvjF7gxB5XXFwT',
// '3M3vJtqVDVZ15yGTibFb5tKabXJ8iE23iB6dJWbzPsfMz2nJs4fEaKkuwkELno9neYYWRWQuP2Q7ZH7Pz7Ptjj8t',
// '4kADtQVURyiSU8A4quh5C7G2bPdGwA8k7RWAaSiLTeD9iuWuXn2ggEehAtmRPkvmUMHrVjMufQ3cbtsvay4VZ9rA',
// '43Ej9PPXP6djujYz8UZEhh35mTdDRJvQdjaH3fUUtGKaTYpty7MgrhtJCzTCw2289kgJeD2xid9RqnDqovt1FF8o',
// '4tcMt2ksFNKxFUveaYvkfrEVJuFsnfQ3dkjvavyYaqfppF7SBmdZroS99qVffMxDQqyTdBFWpktvdNPpt8pG5hri',
// '36a8ie7dfMCf6XMGAm92yxuRtXAKCViHVcgGdnCF7brTSZYszMU5yf2pzPCwBRgtFdN9jF7Bo3K9Fa47kB67UTgW',
// 'T9q2cWocco8a53LeGxBt1b4VgaKCbasMpcyY4EiGGYhGCzoKo8aPakHwU1kETXJt5TAC7qyFfRjCNKCZTmgrDeB',
// '3YZVW8LeWAZm6Fx6bEoKnEBUSR1RoKgbrk3wttGqBNZaiAuE6S63WtDXbjgr7yhQXq7dDJM2ufXWdfeTzgFJ2DdF',
// '5GpQ3yYUFaXq8xwjDKztyUZoXW5W7k91suEVeBnWfMVVNHZZ69TcUXUjjCPVkZknXXokstiKsqK8UwVo1vJnWeoj',
// '2AWHeTQYoH6hRqCmVLLCia6TLYZMRapCL67KLLpn16vQDRsgUsEfFYdZVRpF4xr6VsvQCJtWDh6wTkwoy44fyTQC',
// '4VYNsdWnBCrqN9puVYj8Rzn6hJCwDKiot5SToKVNvzQF6NAWYNhZrUPCujELaeBX5BcBf1P3QMKWrJbiAB69Xvre',
// '4ap8r4HWYAtvoRSCmbHHmPbvqjR5FTQBBmFHQVKqzDP16uPyLhQkkqWTcm6cGdutcpufYoDAwCJZKyyZUL52LvDS',
// 'wy2LrtR3YGduRQARvuXWWQW5nUaadzyxeDjSMM3ktji3bzLpqGKjcpC6kSvXSHGuyM1Kk4f3ukV1QtA3U5mktbP',
// 'eGjskoLGHv7K4BgLD8e1RBAa2zmC6XJdSNYABaEHCwUUUKeS3GTZy3bMGFomGez3SGzkhw9KuEb3hyZA7SJWMAE',
// '3wL5QeEUKJxqmzA1YH3nEM8LuxfKoCx3UDZ1kx95xWoxg8zja2D146GFzLAFY2hEkM8EhE4NZqrUSk21JNn5AEhm',
// '3XDuQw2xphbxvx3PqgqoFkHVWDjVqjwKbnEP1jtfy43whdTqz717bBQXPFp36eYzwbRny1d5EtJUyujZxU7ZWQCV',
// '2EJ7GsoMwPZudJm3jda7cUD6fh37x3deb86xuPp5iPRvmQb1cCobJbcN44KtjoMdo83ga8MQxQ8RZK2wDyCAxy7J',
// 'DoT9M6Xtc9CAk27gYvb2XFx3P8d5aHCCotDmgZ3L1PKVkJXxKqwaZpJFDn8t36FnftscqjgK792w8nWXnQ8FJrP',
// '63teRjMb5kJJWuT1PxARwN1uAdpa5fv3VgEYUHZ8MyeATHgcHe5ebScnvG18tTpqMHKYp5nYZjNak1sb9rX1N6U3',
// '26ppzsciuWCmZ38gXZBnQwk6oKSSguNdBM8uWbbN15sE3a4dkU2RqkUdHE1bafM3feeA1iQ9wXHrqB5R5R3rguQF',
// 'PciUpUThaVSchh7xFyBsBr51cbeJVwG64wjSf2fYqfDfz4tqtm9gee3nfQ3K1kYKL6w2R2r1iA4hEh6L1hcJVSw',
// '3Jz8sg2zhYxtqQxry2itBgY1NZXAbZV6skKVZ4kwtGHXt5yfzxxbsYs2TSRiZ8MYL5N6VVxbA42JPBpuXju3ssxZ',
// '8zJw1fGo6RUbEcnLuNxMwTwkD7oPBU7gY1gkyH3Q61Hajz7HCrMmF4bZfumVRSRQz19p124UsSG2F1VxbKn6ftF',
// '5FLBcsm7yv5YV1MoQXDWddjy6YS17apGQq4ud2TmtfnhG7Q2woWbDaSHQepaLyAkE1vf26PuP8uBQWeiL9BYWgGC',
// 'hQMGEjgbZdHZ9xznNKD9MDN5QK3pWuzXR77ijfU7KLzfiFAsEpq1F9vXT7o6urbp9pSCNBRsi6ktHG2Jnsyyi9F',
// 'cnkQSzT2BrezawFanbsnMAFo2VnEDGb2H6RzzZHmdSaCqpERSKLjieVrcdaeqB7ASUpGGuADV1xmijg1e2TW37F',
// '5K9QKD4RA4fKs9QZETZJmRdzdRGg2n8TC9rx77ME27RsqkULvhhJSqYMpVXJ69bZmpbHjB71HcEJaDv89UghPUgZ',
// '3PaqoLe2GhkuqUe1Nu3EAp42jKYdrLvQts4nmTXyGXxgN675BZtmEN9NYDPmtPYbu4KW91kne2P6i5owwbVjx4in',
// '3EBKWAskcfomk2QKRNMUJCETBsCn1BpUmXKteTySSNqfVfWtkTGwtrSTov59N8Pa4gSLUA9ga5pnyo48HbpEw9ga',
// '5DYrERacat6wd6r4PVXqt8Z7puzBqRSgr8n43tk7MaESq8xsMqNZcQ5oyGe65nSj1eWFg6ZL5qyDx1X3XoDWB6eC',
// '2YN1N8m3wtEJi99nSSgC14iwBDwqxADSkrf2j2ntt1gqfVAr9ER3T4VcCaDhMopzWht3rRiyGpuad1qTcrrTKstq',
// '4DPQuzGCDUFXAwseYbhySXt9YMemVbTges1aGHPybQdCydGod58BncbWSauYLBWeYNqQLzHkj5mrqpSzHpGqvM5G',
// '46CuwLCPGzgM3YxsATwXRFovMYq816WytSieQy9kTnqu6NUL5Nw2TS9rUmca98DWWzK58DHmzrfHf5CgCTCsVa63',
// '5CjxgYZQYeJTnBBDZFJHmrdAecm7EQE5jS7sgnNUMwes3oaJoAPSHS87wHRLmUuXidGco87qtDH5PutqUZZ33fLy',
// 'CpQDGdL3S353fZRFNVUhCZnHE4LQjJsPRQRFARBAwVMer5Yu77HrLiVYa4UjcrxPCU2tDLFaSy24JXCsw8oJSzX',
// 'AG1GfiKMoSmCaecBNRNPamvMNbk67eAniELdz9hJiJHUu279gHzqwPQYDGhHTj2CH8iXj6CSvnHNfupFMzqnvGk',
// '4CUyvYGn7wcseRMqRCKjr5fuQX4Q1E2GcCVKTtyn8aQSNbg82afkXPWcGiEU9ktmcMFbtLM46B1aGvKKrgKnYFzi',
// '5B2eQFXHexK5jSk2ctik1v9sTH25KVknEmZxUDyP4kLVs72PwNDXZJ7GpGkFdSHJLS6hrbn7vwSmosyVhVBTU6i3',
// '3n2gXukUu1KdFvQGoZFg7w5ggiQFgex3iCmeEqXYwT6krwntwZMRLSyrzF368nCVhuiPYYYAvo8dzF4FVyoHvGBC',
// '4WwSCZWyGKYSoTHJPnG7e8VjJuxjUgayzjm8KQCLnbdWHpzP3RuhvqoUgqmmURYmBCCxiHoz582rLzirVpWpJtbv',
// '5upTTNar8padYyxcset6Uzjjyq5fxdt7DL7TWJP4bJ92BJ1kBYHu9QcrECcmsTm4YmZpebopmAKbCn5aLcAeu2BY',
// '5pydzk9nU5LEi8BAMBQCUJqKYYGD9fxo3hVycLFTt6nV6W7MiWJn39xGvq6B5Q5JZQFKyeWEHqJDjzcxrWQPEpsx',
// '47QRgJ9B6VkfQ7bi69baDsqXKRCKqiKFxC4V5yyBp4NanoUfMaqNUiJSeMy8jhaksNnHeVR9Z5enAnGr1P2AHU7a',
// 'pF9NrG1QjJZheGnM3cYadqJpuUUAL3jVTz2VoMYqPg7sxhQstk7KqoQ6xdGramx2c4puHQhBQNagvkusXG5gUcs',
// '2AQvsE533PUdnPPkWuSu3C79RcAvMD25EC82qqXm1z3ifQHZ6XwuoXzepovvXkLwn912E3cDknSGyA7CSwrw41Ji',
// 'xeViGCseG66mmf4Xaxytru4VNwp2CuJHZg1kSA2UMNRywREbS7NukfxzmR3ogJKrkSzR1JzVD5T85j8kru8vYpM',
// '4RWcsG5wytuap3giQmVv1EshPhDqd5WxoVaXHYkUepq7o5ykVUE2PQUPxXLAxdEkyTWXunCEpxaNBKdodjSvhbvh',
// '5sJJsaMRpndDNmB8oVq9rs14R8b3VbDwwp5UE5r88Xv1FhBcDg1z6waYwv7UotSpExxfQRxX1HtR1fk9LT2SBty3',
// '2Gj5SDUkEL8VjAAXDJR3fjTFuByjZvqgJxKjkUHoqskEr2e1p7tTvWUWonddJ5ANVrbNFEzJbKrr7RnFxY7jP5vq',
// '4b3nxwP1zaLuFAzF3hpgYUAQcqzZjnz78CaSYX4v8KwtUGAFE5tHK954m5kVdsD5G5woArUWQGk9mhrFf2BzzKzr',
// '4BSzPcKsghDAAwBSHMomaABspu69j4B4cVdTJanJaWTizkmqv19EJ3trCGoaEfWfR7qqbiCiW9e44voizwgPNpaC',
// '5JiTbH5T7FJtSrErnsBMFCStbWmUtviQkTeve9Lmwg3URMyYJq1ExPvsEaWAKxU83Le69Ja5Z9B1AQBSUFLhH5RX',
// '2bC9quyYcTafvhjZf7e3WsQHqbfPWxpemkXswSXhgX8STxmKm59PGogerR3ikVK3DZDYaRe6DaqVKrnAMGzwJ3Fb',
// '3xR1qEetq1NVeu3W9HL6Lry6Tt62JkAbw7G2cLEYmuUqUF9bqQBYMz2M7HGxjYdA2hVkkY5L7xQ3prgsa943RBMm',
// '2L9ZMh714yeuRF91QyViniqZaGm6qMEcV74HYvzk3iKKznVSPfeGbmYrtQ3KYJKzYT1eFxeK6iHJ3xZHRJKP6kC5',
// '2MK729pzKrnAhBdPbN9C2oCPiqngB2eMAbCqGEXsUTpEuxV5iyVYrJ7WkZy3g5LGnwKERmqVsXy5AqVcovBnxUtM',
// 'UN6d56EoXFGLEqTGH7aTQ1UX64Vogng8RmYbrw7UjNixrdXKL9LCAtEsreg2YWTHKETpnEbdt8xPLq5yMurVhRK',
// '4AMb12uwAvWjZZUuviZgMuLVo92LgnrrMFEsSjCozEE1wiKx5gG6vNDu5DG6KXqJbrzFCEP5Ae9MC1JU7mA6s1p9',
// '2vWnA82SyLXowG8jPvEMguaJA53z8NRKg7NQAAgAEoyrWArNZKQDiFHDDmmvHv3oP4KiBQNYBqqAfxRqqZpwVqZB',
// 'Cchf3sZTQscZJu9uSARx5fJEDkwf2mWhRbSzQM3ajCNnDSud6yvEgQZRBTdh8jQp2ApQbuKcv2v87gaAgeEZDoz',
// '4U4aX7b47K8t7D9guNVnc7zM4tADuXEKn2bpDLCQqGmsafyGejWYUpxXJkCbiEteYZkAzwYXYEtMrTqm49pXyqZZ',
// '4MkcStc45i5e2NWYikRrXH5vHj8bGXHYMc82qgREPxXwcpwozSWug4xodHBiskDpWYs2wDJu3rmD3cKNQ94XQBEv',
// '3VcAHkcs7TNRXaRmoDu4hKg2DKwNSindprYCtu4AhC8PbF6dLofjToTs3CLRJ5XJJjBvxF6G1buj9WswxZzYp6MA',
// '2BG35ZTUCmC71sEspvgyDDDHHjMnXS9jdDFy19BGLir12Ge5BB1w41Tgzi9waQhzREx2sdBbrehixTVYn9jbsVzG',
// '3X7P1dU94zGTfjhuzMXSxHy7xfT14bEobMfhdTZoQQ9rho8qbFvJDitGPSQrDGv6XEmRypFz1RaY86DYV2hmDjRB',
// 'T6zVJLnT9o6gjZyF9xLZCadSMXGzi8e14ZY9b4Uy2PHEWvX6Djfm8h41t7N1d7BbagUMNNW1cJa8bMNQ4aHpgkL',
// '4rnB3m3PVt7ZKrhp4o1eiMCEcBPGm52G3tmwarqjiigmS6p2hiqyZRpE3HduTP4bWsTwM8xq9BgTVHcotpL4VfDR',
// '2hLF3TJPWvvyBpmmmArGJxKov1YUrHpXhEtHXBmTfpv3oaFMZv3S4ucxkRduhC2hzegUd4MjxVfSqj836z1A1awA',
// '4urCMzpqWgu2oF9qYSEWHMgAUzhgcjWrqTGxDzxtFTV2UoGNre7H8NarYdPESbowCQKprDTi5Kt1D4fjcnGimUMV',
// '4mQDVF5zDHKvKGx74wrB7P8vM2iYzJeTbgoVgp8TCaYXhS1oDVJDkW5FFFp5RyBCNhJ3ciYUAWw6DuSVJCjs4LwN',
// '5nNbWW6hu86VTrnoKgGZhouFKM678VyYr7ztyrve7AKdLbype1vZjEv9838LyFjPAHE1xqsvJ65Eupp64teHSksH',
// '4d3CdrRJoGiPaa6QbaZ1RNVQe8xSmpTgJooN1Evob8o1bWPtE8XqUZs2hBNHKPce2U5mhn8UA5pTsSCxqrVhvM3L',
// 'PW4mNMPKHaBXRbZkXRaZ8gdxvLqRh4pJoWDSqf8ZSNZHyHFkcEzUUuMyaqJaSXNXvvUbWtMAijra1awVK4wBfUa',
// '37m1RBsr8zFaS7LtL8Jej4H4WmeDaxzf6x4aCqvGE1jd8bW8byxPhpAxhcHsGhGco1vycFsHnqMc6XFTL9CghNFN',
// '29dpbD9jEtVqJt4e2q7n3TE12eWhFkE7RCVdDYmyAF5QWgbYegdNC4XWrqRqFV1CVn9GzuQSEBdLgaWL7rHDHmdk',
// '4yBX3Yn97CCLiaRbZEQ8NrQ2zkGnmJm9vnscndMWwSBwzmGVNLWRWgo2gyaSp7faUvNae1L8V8dUVhSpg2XQ5rej',
// '5vjmFqxGhKG5VK97XN3RnDHv9Xk6njgbVmfjQDbuxX5g8kFMovTVySJwP5rtEYD6qPWPw55tXrZNGRm98DPCnFPs',
// '2SPULbtRv6pi2NNZWbGPU86gehtSzTftv92Y12Gpt67qRYNTcUaAXhjHbVetZFwQ9TNaW6JJ2uAGzNmQoTF4zrtA',
// '5wgwqQ3zBgrkKzZ2ARHFyAZyGyYevKa4FB5w2VZLWtxCMb3kAwGkhxvdC7JMoWThWsRRLq68cLxrZGfsyTxNvkv6',
// '5RVZAsqb7ja5XfCkZmZhigDRk6TgmiKMoLxFPUKGfipjmGR5WKSqYdozWRjJFs1mFrWPhduwE9S2SCTys7KK1GHu',
// '2namgrtB6hpx1EPfbrqPh19kEWJTynaTHZNEPNz8gGqo4u9eXhRrxcGtiheQg5hscecFq4gnA8g7DChuJHC7Zgcm',
// '45jPx29yJqgvEh212FPWWDTBiRsEjFfGHgaxGKbEFj7ku8AW4ayNNygodKDgeAjUnF4GZKDix7BaXk5mR14Rx5jZ',
// 'aZoN1exMEjrrEMf3PjcUs1X4uionm9ttkyNVayrGYvsmLGnuFNhCRg8x5iEqE6A8fPTJ1e2akscFZuQS7fBDmUS',
// '3ddMwzQvM7FsSBR6g9RXmVXrFKopprDAnQYaHVC8WK5Y88j94omub2TngGTX7aRS84cxx9ZsAosnPa43nbmtv44e',
// '3NBffgvPKqxM1DVKcjyphJb8Y2BGUeN91f2U46D6VKmW5SMwEfbLhNXzRhYJQi5cmUT5XuSQ3s5HzbpHsfVtdCZS',
// '4FxemdS1twpYrtw5NgW72gmaF3yDZcpdKXiPf3wCmLX6fqcXkVrjkdwGe9UTqBAynN3U13dLqtBD9X4h5sdTRA7z',
// 'AyRNakKXPr2KNXkZ6JGrhFyZ4WH9pPNron16RLRm63nV4zapVk469XjWqkVe1jpiC4f8L7MfWUu1hqMgptHmS7A'
// ];


(async () => {
  // const keypairs = pks.map(key => Keypair.fromSecretKey(base58.decode(key)));
  // console.log(pks.length);
  // let i = 0;
  // for(const key of keypairs) {
  //   // await sleepTime(1000)
  //   console.log(key.publicKey.toBase58());
  //   try{
  //     const tokenAccounts = await connection.getTokenAccountsByOwner(
  //       key.publicKey,
  //       { programId: spl.TOKEN_PROGRAM_ID }
  //     )
  //     i += tokenAccounts.value.length;
  //   }catch(e){
  //     console.log(e);
  //   }
  // }

  // console.log(i)

  // const instructions: TransactionInstruction[] = [];
  // for (let i = 0; i < tokenAccounts.value.length; i++) {
  //   const balance = await connection.getTokenAccountBalance(
  //     tokenAccounts.value[i].pubkey
  //   );
  //   console.log(tokenAccounts.value[i].pubkey.toBase58())

    // if (Number(balance.value.amount) > 0) {
      // await spl.burn(connection, walletKeypair, tokenAccounts.value[i].pubkey, new PublicKey('12Nw41dxn2Y6sg6YPaqttGELvR3JjXHdTJxuFf4vwu1L'), walletKeypair, Number(balance.value.amount))
      // const transferInstruction = spl.createTransferInstruction(
      //   tokenAccounts.value[i].pubkey,
      //   new PublicKey('3HU7wsi5bQa3yjLUapRSFWJk9WzY8cqQVcmn6arCSdWL'),
      //   walletKeypair.publicKey,
      //   Number(balance.value.amount)
      // );
      // instructions.push(transferInstruction);
    }
  //   else{
  //       const closeAccountInstruction = spl.createCloseAccountInstruction(
  //           tokenAccounts.value[i].pubkey,
  //           owner.publicKey,
  //           walletKeypair.publicKey
  //         );
  //         instructions.push(closeAccountInstruction);
  //   }
  // }
  // const tipInstruction = SystemProgram.transfer({
  //   fromPubkey: owner.publicKey,
  //   toPubkey: getJitoTipAccount(),
  //   lamports: 10000,
  // });
  // instructions.push(tipInstruction);
  // await sendBundle(instructions);}
)();