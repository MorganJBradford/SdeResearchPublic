export type NavObject = {
  header: string;
  link?: string;
  navOptions?: NavOption[]
};

export type PublicationType = 'academic' | 'practitioner';

export type PublicationTypeOrFalse = PublicationType | false;

export type NavOption = {
  subheader: string;
  link: string;
  id?: number;
};

export type User = {
  email: string;
  profilePicture?: string;
  researcherName: string;
  researcherId: number;
  isAdmin: boolean
}

export type Researcher = {
  researcherId: number;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  imageName?: string;
  institution: string;
  department: string;
  biography?: string;
  hasAdminApprovedProfile: boolean
};

export type ResearcherProfile = {
  researcherId: number;
  firstName: string;
  lastName: string;
  institution: string;
  department: string;
  biography: string;
  profilePicture: string;
  imageName: string
}

export type TopicIdName = {
  topicId: number;
  topicName: string
}

export type BaseTopic = TopicIdName & {
  type: string;
  isTopicPagePublished: boolean
}

export type TopicManagerTopic = BaseTopic & {
  categoryIds: number[];
}

export type Topic = BaseTopic & {
  topicCategories: BaseTopicCategory[];
};

export type BaseCategory = {
  categoryId: number;
  categoryName: string;
  type: string;
};

export type BaseTopicCategory = {
  topicCategoryId: number;
  categoryId: number;
  topicId: number
}

export type TopicCategory = BaseTopicCategory & {
  topic: BaseTopic;
  category: BaseCategory
}

export type Category = BaseCategory & {
  topicCategories: TopicCategory[]
}

export type TopicWithDetails = BaseTopic &  {
  details: TopicDetails | null;
};

export type TopicDetails = {
  topicDetailsId: number;
  imageUrl: string;
  imageKey: string;
  researcherId: number;
  researcher: Researcher;
  sections: TopicSection[]
}

export type TopicSection = {
  sectionId?: number;
  displayOrder: number;
  sectionTitle: string;
  sectionBody: string
};

export type BasePublication = {
  publicationId: number;
  citation: string;
  linkToSource: string;
  isPublished: boolean;
  publicationUrl: string;
  publicationKey: string;
  contactEmail: string
}

type Publication = BasePublication & {
  topicIds: number[];
  topicCategoryIds: number[]
}

export type PublicationTopicCategory = {
  publicationTopicCategoryId: number;
  publicationId: number;
  topicCategoryId: number;
  topicCategory: BaseTopicCategory;
}

export type ResearcherIdName = {
  researcherId: number;
  researcherName: string;
}

export type AcademicPublication = Publication & { type: 'academic' }
export type PractitionerPublication = Publication & { type: 'practitioner' }

export type PublicationForm = BasePublication & {
  type: PublicationTypeOrFalse ; topicCategoryIds: number[]; topicIds: number[]
} | Publication  & {
  type: PublicationTypeOrFalse; topicCategoryIds: number[]; topicIds: number[]
};

export type News = {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string
};

export type ImageToUpload = {
  imageSrc?: string | ArrayBuffer | null;
  imageFile?: File;
}

export enum HttpStatusCode {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  Unauthorized = 401,
  InternalServerError = 500,
  BadGateway = 502
}

export type ServerResponse = {
  statusCode: HttpStatusCode;
  message: string
}

export type AuthResponse = ServerResponse & {
  data: User
}

export type UpdateResearcherResponse = ServerResponse & {
  data: Researcher
}

export type GetAnyTopicsExist = ServerResponse & {
  data: {
    anyTopicsExist: boolean;
    academicTopicsExist: boolean
  };
}

export type GetResearcherByAuth = ServerResponse & {
  data: {
    researcher: Researcher;
    profilePicture: string
  }
}

export type GetScholarshipSummaries = ServerResponse & {
  data: TopicIdName[]
}

export type GetPublicationsSortedByType = ServerResponse &
{
  data: {
    academicPublications: AcademicPublication[];
    practitionerPublications: PractitionerPublication[];
  }
}

export type GetSortedTopicsAndCategories = ServerResponse & {
  data: {
    academicTopics: TopicManagerTopic[];
    practitionerTopics: TopicManagerTopic[];
    academicCategories: BaseCategory[];
    practitionerCategories: BaseCategory[]
  }
}

export type GetTopics = ServerResponse &
{
  data: Topic[]
}

type TopicCategoryIdCategoryNameDto = {
  topicCategoryId: number;
  categoryName: string;
}

export type TopicIdNameTopicCategoriesDto = {
  topicId: number;
  topicName: string;
  topicCategories: TopicCategoryIdCategoryNameDto[]
}

export type PublicationCategory = BaseCategory & {
  topics: BaseTopic[]
}

type CategoriesSortedByTopic = {
  categoriesByTopic: TopicIdNameTopicCategoriesDto[]
}

export type GetTopicCategoriesSortedByTopicNameResponseDto = ServerResponse &
{
  data: CategoriesSortedByTopic
}

export type GetPublicationsPage = ServerResponse & {
  data: {
    categories: PublicationCategory[]
  }
}

export type GetPublications = ServerResponse & {
  data: BasePublication[]
}

export type GetTopicByIdResponseDto = ServerResponse & {
  data: TopicWithDetails;
}

export type GetResearchersIdsNames = ServerResponse & {
  data: ResearcherIdName[]
}

export type PreSignedUrlData = {
  bucketName: string;
  key: string;
  expires?: Date;
  url?: string;
  file?: File;
}

export type GetPreSignedUrlResponseDto = ServerResponse & {
  data: PreSignedUrlData;
}

export type GetAdminDashboardResearchers = ServerResponse & {
  data: {
    researchers: Researcher[];
    adminCreatedResearchers: Researcher[]
  }
}

export type GetLatestNews = ServerResponse & {
  data: News[]
}

export type ConfirmationDialogProps = {
  id?: number;
  dialogTitle: string;
  dialogDescription: string;
  openDialogButtonProps: {
    styles: React.CSSProperties
    text: string
  };
  confirmationButtonProps: {
    styles: React.CSSProperties;
    text: string;
    onConfirm?: () => void;
    onConfirmById?: (id: number) => void;
  }
}

export enum VIEW_TYPE {
  INVITE,
  INVITE_NEW,
  INVITE_EXISTING,
  CREATE,
  EDIT,
  VIEW
}

export type PublicationFormFieldName = 'citation' | 'linkToSource' | 'contactEmail';

export type ResearcherFormValues = {
  researcherId?: number;
  firstName: string;
  lastName: string;
  institution: string;
  department: string;
  biography: string;
  imageUrl?: string;
  imageKey?: string
}
