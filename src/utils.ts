/*
 * Copyright (C) 2022 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster
 *
 * This file is part of SEET
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { RegisterRequest, Scenario, UA, UACMode } from "./types"
import SIPP from "sipp-js"

export const getRandomPort = () => Math.floor(Math.random() * (6000 - 5060)) + 5060

export const register = (req: RegisterRequest) => {
  new SIPP({ remoteHost: req.registrarAddr, localPort: req.myPort})
    .withScenario(`${process.cwd()}/scenarios/registration.xml`)
    .setUsername(req.username)
    .setPassword(req.secret)
    .setVariable('username', req.username)
    .setVariable('domain', req.domain)
    .setVariable('expires', `${req.expires}`)
    .withTransportMode(req.transportMode)
    .start()
}

export const getConfig = (envname: string): Scenario[] => {
  if (!process.env[envname]) {
    console.error(`the environment variable ${envname} wasn't found`) 
  }
  
  try {
    return require(process.env[envname])
  } catch (e) { 
    console.error(`the configuration file is invalid or doesn't exist: file => ${process.env[envname]}`)
    process.exit(1)
  }  
}

export function sendRegister(scenario: Scenario, ua: UA, port: number) {
  register({
    registrarAddr: scenario.target,
    myPort: port,
    domain: scenario.domain || scenario.target.split(':')[0],
    username: ua.authentication?.username,
    secret: ua.authentication.secret,
    expires: ua.expires,
    transportMode: ua.transportMode
  })
}

export function createAgent(scenario: Scenario, ua: UA, done?: (message?: string) => void) {
  const port = getRandomPort()

  if (ua.sendRegister) sendRegister(scenario, ua, port)

  const remoteHost = ua.mode === UACMode.UAS ? scenario.target : undefined
  
  const client = new SIPP({ remoteHost, localPort: port })
    .withScenario(ua.scenarioFile)
    .withTransportMode(ua.transportMode)

  if (ua.authentication) {
    client.setUsername(ua.authentication.username)
      .setPassword(ua.authentication.secret)
  }

  if (ua.mode === UACMode.UAS) {
    client.startAsync((result: unknown) => result ? done("failed: " + result) : done())
  } else {
    client.start()
  }
}