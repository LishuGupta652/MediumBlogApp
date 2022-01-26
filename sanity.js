import {
  createImageUrlBuilder,
  createCurrentUserHook,
  createClient,
} from 'next-sanity'

export const config = {
  dataset: 'production',
  projectId: 'ynkgfdlg',
  apiVersion: '2022-01-26',

  useCdn: process.env.NODE_ENV || 'production',
}

export const sanityClient = createClient(config)

export const urlFor = (source) => createImageUrlBuilder(config).image(source)

export const useCurrentUser = createCurrentUserHook(config)
