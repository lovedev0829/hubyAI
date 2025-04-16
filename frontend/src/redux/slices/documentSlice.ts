// src/redux/slices/documentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DocumentState {
  productName: string;
  background: string;
  logo: string | null;
  sourceType: string;
  pricingType: string;
  modelType: string;
  traction: string;
  mainCTA: string;
  sliderFiles: File[];
  descriptionCTA: string;
  personalMessage: string;
  captionImageFile: File | null;
  captionAudioFile: File | null;

  // New fields for SpecsTab
  designedFor: string;
  availability: {
    web: boolean;
    mobile: boolean;
    local: boolean;
    api: boolean;
  };
  features: string[];
  poweredBy: {
    name: string;
    developedBy: string;
    type: string;
    license: string;
    version: string;
  };
  source: string;
  programmingLanguages: string[];
  dependencies: string[];
  api: string;
  operatingSystems: string[];
  repository: string;
  localRuntime: {
    minGpu: string;
    optimalGpu: string;
  };
  pricing: {
    pricingLink: string;
    tiers: { name: string }[];
    pricingScreenshot: File | null;
  };
  news: {
    newsLink: string;
    newsAnnouncement: string;
  };
}

const initialState: DocumentState = {
  productName: "",
  background: "select",
  logo: null,
  sourceType: "select",
  pricingType: "select",
  modelType: "select",
  traction: "select",
  mainCTA: "",
  sliderFiles: [],
  descriptionCTA: "",
  personalMessage: "",
  captionImageFile: null,
  captionAudioFile: null,

  // New fields initialized
  designedFor: "",
  availability: {
    web: false,
    mobile: false,
    local: false,
    api: false,
  },
  features: [],
  poweredBy: {
    name: "",
    developedBy: "",
    type: "",
    license: "",
    version: "",
  },
  source: "",
  programmingLanguages: [],
  dependencies: [],
  api: "",
  operatingSystems: [],
  repository: "",
  localRuntime: {
    minGpu: "",
    optimalGpu: "",
  },
  pricing: {
    pricingLink: "",
    tiers: [],
    pricingScreenshot: null,
  },
  news: {
    newsLink: "",
    newsAnnouncement: "",
  },
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    // Existing reducers...
    setProductName: (state, action: PayloadAction<string>) => {
      state.productName = action.payload;
    },
    setBackground: (state, action: PayloadAction<string>) => {
      state.background = action.payload;
    },
    setLogo: (state, action: PayloadAction<string | null>) => {
      state.logo = action.payload;
    },
    setSourceType: (state, action: PayloadAction<string>) => {
      state.sourceType = action.payload;
    },
    setPricingType: (state, action: PayloadAction<string>) => {
      state.pricingType = action.payload;
    },
    setModelType: (state, action: PayloadAction<string>) => {
      state.modelType = action.payload;
    },
    setTraction: (state, action: PayloadAction<string>) => {
      state.traction = action.payload;
    },
    setMainCTA: (state, action: PayloadAction<string>) => {
      state.mainCTA = action.payload;
    },
    setSliderFiles: (state, action: PayloadAction<File[]>) => {
      state.sliderFiles = action.payload;
    },
    setDescriptionCTA: (state, action: PayloadAction<string>) => {
      state.descriptionCTA = action.payload;
    },
    setPersonalMessage: (state, action: PayloadAction<string>) => {
      state.personalMessage = action.payload;
    },
    setCaptionImageFile: (state, action: PayloadAction<File | null>) => {
      state.captionImageFile = action.payload;
    },
    setCaptionAudioFile: (state, action: PayloadAction<File | null>) => {
      state.captionAudioFile = action.payload;
    },
    clearDocument: () => initialState,

    // New reducers for SpecsTab
    setDesignedFor: (state, action: PayloadAction<string>) => {
      state.designedFor = action.payload;
    },
    setAvailability: (
      state,
      action: PayloadAction<{
        key: keyof DocumentState["availability"];
        value: boolean;
      }>
    ) => {
      const { key, value } = action.payload;
      state.availability[key] = value;
    },
    addFeature: (state, action: PayloadAction<string>) => {
      state.features.push(action.payload);
    },
    setPoweredBy: (
      state,
      action: PayloadAction<DocumentState["poweredBy"]>
    ) => {
      state.poweredBy = action.payload;
    },
    setSource: (state, action: PayloadAction<string>) => {
      state.source = action.payload;
    },
    setProgrammingLanguages: (state, action: PayloadAction<string[]>) => {
      state.programmingLanguages = action.payload;
    },
    setDependencies: (state, action: PayloadAction<string[]>) => {
      state.dependencies = action.payload;
    },
    setApi: (state, action: PayloadAction<string>) => {
      state.api = action.payload;
    },
    setOperatingSystems: (state, action: PayloadAction<string[]>) => {
      state.operatingSystems = action.payload;
    },
    setRepository: (state, action: PayloadAction<string>) => {
      state.repository = action.payload;
    },
    setLocalRuntime: (
      state,
      action: PayloadAction<DocumentState["localRuntime"]>
    ) => {
      state.localRuntime = action.payload;
    },
    setPricingLink: (state, action: PayloadAction<string>) => {
      state.pricing.pricingLink = action.payload;
    },
    addPricingTier: (state, action: PayloadAction<{ name: string }>) => {
      state.pricing.tiers.push(action.payload);
    },
    setPricingScreenshot: (state, action: PayloadAction<File | null>) => {
      state.pricing.pricingScreenshot = action.payload;
    },
    setNewsLink: (state, action: PayloadAction<string>) => {
      state.news.newsLink = action.payload;
    },
    setNewsAnnouncement: (state, action: PayloadAction<string>) => {
      state.news.newsAnnouncement = action.payload;
    },
  },
});

export const {
  setProductName,
  setBackground,
  setLogo,
  setSourceType,
  setPricingType,
  setModelType,
  setTraction,
  setMainCTA,
  setSliderFiles,
  setDescriptionCTA,
  setPersonalMessage,
  setCaptionImageFile,
  setCaptionAudioFile,
  clearDocument,
  setDesignedFor,
  setAvailability,
  addFeature,
  setPoweredBy,
  setSource,
  setProgrammingLanguages,
  setDependencies,
  setApi,
  setOperatingSystems,
  setRepository,
  setLocalRuntime,
  setPricingLink,
  addPricingTier,
  setPricingScreenshot,
  setNewsLink,
  setNewsAnnouncement,
} = documentSlice.actions;
export default documentSlice.reducer;
