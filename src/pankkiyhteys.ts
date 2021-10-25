/**
 * @file Main entrypoint
 */

import createDebug from 'debug'

import { Key } from './trust'
import * as app from './application'

import { OsuuspankkiCertService, NordeaCertService } from './cert-services'

export const debug = createDebug('pankkiyhteys')

interface FileDescriptor {
  FileReference: string
  TargetId: string
  UserFilename: string
  ParentFileReference: string
  FileType: string
  FileTimestamp: string
  Status: 'NEW' | 'WFP' | 'DLD'
}

interface FileListResponse {
  ApplicationResponse: {
    FileDescriptors: FileDescriptor[]
  }
}

export { CertApplicationRequest } from './application'
export { Key } from './trust'

export class Osuuspankki extends app.Client {
  constructor(
    username: string,
    key: Key | undefined,
    language: app.Language,
    environment = app.Environment.PRODUCTION
  ) {
    const certService = new OsuuspankkiCertService(username, environment)
    const endpoint = Osuuspankki.getEndpoint(environment)
    const bic = 'OKOYFIHH'
    const compressionMethod = 'RFC1952'

    super(username, key, language, bic, endpoint, certService, environment, compressionMethod)
  }

  private static getEndpoint(environment: app.Environment) {
    return {
      [app.Environment.PRODUCTION]: 'https://wsk.op.fi/services/CorporateFileService',
      [app.Environment.TEST]: 'https://wsk.asiakastesti.op.fi/services/CorporateFileService'
    }[environment]
  }
}

export class Nordea extends app.Client {
  constructor(
    username: string,
    key: Key | undefined,
    language: app.Language,
    environment = app.Environment.TEST
  ) {
    const certService = new NordeaCertService(username, environment)
    const endpoint = Nordea.getEndpoint()
    const bic = 'NDEAFIHH'
    const compressionMethod = 'GZIP'

    super(username, key, language, bic, endpoint, certService, environment, compressionMethod)
  }

  private static getEndpoint() {
    return `https://filetransfer.nordea.com/services/CorporateFileService`
  }
}
