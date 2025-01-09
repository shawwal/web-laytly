import { NextResponse } from 'next/server';

const sendPushNotification = async (expoPushToken: string, title: string, body: string, data: Record<string, any> = {}) => {
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

export async function POST(request: Request) {
  try {
    const { expoPushToken, title, body, data } = await request.json();

    if (!expoPushToken || !title || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await sendPushNotification(expoPushToken, title, body, data);

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to send push notification' }, { status: 500 });
  }
}
