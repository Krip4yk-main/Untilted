export class UtilsService {

    private static instance: UtilsService;

    private constructor() {
        // intentionally empty
    }

    public static getInstance(): UtilsService {
        if (!UtilsService.instance) {
            UtilsService.instance = new UtilsService();
        }
        return UtilsService.instance;
    }

}

export const utilsService = UtilsService.getInstance();
