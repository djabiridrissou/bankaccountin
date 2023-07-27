import { NextFunction, Request, Response } from "express";
import { AccountService } from "../service/Account.service";
import multer from 'multer';
import path from 'path';
const documentsFolder = 'assets/xlsx';

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only .xlsx file expected!'), false);
    }
}

export default class AccountController {

    private accountService: AccountService;

    constructor() {
        this.accountService = new AccountService();
    }

    public loadAllHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountList = await this.accountService.loadAll();
            res.status(200).json({
                message: 'success',
                data: accountList
            });
        } catch (e) {
            next(e);
        }
    }

    public loadByIdHandler = async (req: any, res: Response, next: NextFunction) => {
        try {
            const h2h = await this.accountService.loadById(req.params.id);
            res.status(200).json({
                message: 'success',
                data: h2h
            });
        } catch (e) {
            next(e);
        }
    }


    public createFromXlsxHandler = async (req: any, res: Response, next: NextFunction) => {

        const upload = multer({
            fileFilter,
            storage: multer.diskStorage({
                destination: function (req, file, callback) {
                    callback(null, documentsFolder)
                },
                filename: function (req, file, callback) {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                    callback(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
                }
            })
        });

        const uploadMiddleware = upload.single('xlsx');

        console.log('uploadMiddleware', uploadMiddleware);

        uploadMiddleware(req, res, async (err: any) => {
            if (!req.file) {
                next(new Error('No file uploaded'));
            } else if (err) {
                next(new Error(err.message))
            } else {
                try {
                    const accountList = await this.accountService.createAccountFromXLSX(req.file.path)
                    res.status(200).json({
                        message: 'success',
                        data: accountList
                    });
                } catch (e) {
                    next(new Error(e.message))
                }
            }
        });
    }
}