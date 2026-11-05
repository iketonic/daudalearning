import { S3Client } from "@aws-sdk/client-s3"

const bucketName = process.env.BUCKET_NAME!
const bucketRegion = process.env.BUCKET_REGION!
const accessKey = process.env.ACCESS_KEY!
const secretKey = process.env.SECRET_KEY!

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
    },
    region: bucketRegion
})

export default s3;