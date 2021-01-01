import { FeaturesPermisstionRequest } from './featurespermisstionrequest';

export class ScreenPermisstionRequest {
    featureId: number;
    featureName: string;
    featureTitle: string;
    featureDescription: string;
    allowed: boolean;
    features: FeaturesPermisstionRequest[];
}