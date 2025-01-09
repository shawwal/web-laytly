// utils/sendPushNotification.ts

/**
 * Sends a push notification to a device using Expo's push notification service.
 * 
 * @param expoPushToken - The Expo Push Token of the target device.
 * @param title - The title of the notification.
 * @param body - The body content of the notification.
 * @param data - Optional data to send with the notification.
 * @returns The response from the Expo Push API.
 */
const sendPushNotification = async (
  expoPushToken: string,
  title: string,
  body: string,
  data: Record<string, any> = {}
): Promise<any> => {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data,
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const responseData = await response.json();
    if (response.ok) {
      console.log('Push notification sent successfully:', responseData);
      return responseData;
    } else {
      throw new Error(`Error sending push notification: ${JSON.stringify(responseData.errors)}`);
    }
  } catch (error) {
    console.error('Error in sending push notification:', error);
    throw error;
  }
};

export default sendPushNotification;
