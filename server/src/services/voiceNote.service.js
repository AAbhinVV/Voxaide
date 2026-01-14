import multer from 'multer';
import multers3, { AUTO_CONTENT_TYPE } from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: constants.aws_region});

const upload = multer({
    storage: multers3({
        s3: s3,
        bucket: constants.aws_bucket_name,
        contentType: AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb){
            cb(null, {
                fieldname: file.fieldname,
                userId: req.user?._id?.toString()
            });
        },
        key: function (req, file, cb){
            const ext = file.originalname.split('.').pop();
            const random = Math.randomBytes(6).toString('hex');
            const filename = `voicenotes/${req.user._id}/${Date.now()}-${random}.${ext}`
            cb(null, filename)
        },

        fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('audio/')) {
        return cb(new Error('Only audio files are allowed'))
        }
        cb(null, true)
        }
    })
})