import {
  AndroidConfig,
  ConfigPlugin,
  createRunOncePlugin,
  withInfoPlist,
} from '@expo/config-plugins';
import { ExpoConfig } from '@expo/config-types';
import * as path from 'path'; // Importa el módulo 'path'
const pkg = require(path.join(__dirname, '../../package.json')); // Construye la ruta al package.json

const MICROPHONE = 'Allow $(PRODUCT_NAME) to access the microphone';
const SPEECH_RECOGNITION =
  'Allow $(PRODUCT_NAME) to securely recognize user speech';

type Props = {
  microphonePermission?: string | false;
  speechRecognitionPermission?: string | false;
};

const withIosPermissions: ConfigPlugin<Props> = (config, { microphonePermission, speechRecognitionPermission } = {}) => {
  return withInfoPlist(config, (mod) => {
    if (microphonePermission !== false) {
      mod.modResults.NSMicrophoneUsageDescription =
        microphonePermission ||
        mod.modResults.NSMicrophoneUsageDescription ||
        MICROPHONE;
    }

    if (speechRecognitionPermission !== false) {
      mod.modResults.NSSpeechRecognitionUsageDescription =
        speechRecognitionPermission ||
        mod.modResults.NSSpeechRecognitionUsageDescription ||
        SPEECH_RECOGNITION;
    }
    return mod;
  });
};

const withAndroidPermissions: ConfigPlugin = (config) => {
  return AndroidConfig.Permissions.withPermissions(config, [
    'android.permission.RECORD_AUDIO',
    'android.permission.INTERNET', // Agregar si es necesario
  ]);
};

const withVoiceReworked: ConfigPlugin<Props> = (config, props = {}) => {
  const _props = props ? props : {};
  // Configuración iOS
  config = withIosPermissions(config, _props);
  // Configuración Android solo si no está deshabilitado
  if (_props.microphonePermission !== false) {
    config = withAndroidPermissions(config);
  }
  return config;
};

// Actualizar con el nombre de tu paquete
export default createRunOncePlugin(
  withVoiceReworked,
  'react-native-voice-voice-reworked', // Nombre actualizado
  pkg.version
);
