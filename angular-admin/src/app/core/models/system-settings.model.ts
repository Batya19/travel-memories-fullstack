export interface SystemSettings {
    defaultUserStorageQuota: number;
    defaultUserAiQuota: number;
    registrationEnabled: boolean;
    maxUploadFileSizeMB: number;
    allowedFileTypes: string[];
    maintenanceMode: boolean;
}