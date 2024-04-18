import { Router } from 'express';
import { sendFileToBucket } from '../controllers';

const routerS3 = Router();
routerS3.post('/s3/send-file', sendFileToBucket);

export default routerS3;