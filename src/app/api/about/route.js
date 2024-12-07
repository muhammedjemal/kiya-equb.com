import { NextResponse } from "next/server";

const en = `Welcome to Kiya Equb Terms and Conditions!
Kiya Equb is one of the best and most trusted online, in-person and mixed saving platforms in Ethiopia with profound experiance in saving money for the community in a modern and efficient way while keeping the traditional trust and goodness combining both to offer what is possible.
Our goal is to provide you with the best and most efficient online saving platform in Ethiopia. Our mission is to help you save money and make your life easier.
We are committed to providing you with the best possible experience, so please read these terms and conditions carefully before using our services.
By using Kiya Equb, you agree to these terms and conditions and that you will comply with all of them. If you do not agree with any of these terms and conditions, please do not use Kiya Equb.
Terms and Conditions:
1. Acceptance: By using Kiya Equb, you are agreeing to be bound by these terms and conditions.
2. Use of the Service: Kiya Equb is a platform where users can save money and invest money. You can use Kiya Equb to create accounts, save money, invest money, and get the withdrawal safely when meeting the withdrawal conditions. You must be at least 18 years old to use Kiya Equb.
3. Kiya Equb will not charge you for the withdrawal after meeting the set conditions. 
4. You are responsible for keeping the application secure and up-to-date when updates are available.
5. You are responsible for any transactions you make through the Kiya Equb application software.
6. This Terms and Conditions of Use is effective as of any upcoming updates.
7. This Terms and Conditions can be updated at any time without prior notice so it is your responsibility to review these terms and conditions periodically.
8. If you have any questions or concerns about these terms and conditions, please contact us at support@kiyaequb.com.
last updated on June 29, 2024
`;
const am = `እንኳን ወደ ኪያ እቁብ ደንብ እና ሁኔታዎች በደህና መጡ!
ኪያ እቁብ በኢትዮጵያ ውስጥ ካሉ ምርጥ እና ታማኝ የኦንላይን ላይ፣ በአካል እና በድብልቅ የሚሰራ እቁቦች ውስጥ አንዱ ነው።
Terms and Conditions:
1. Acceptance: By using Kiya Equb, you are agreeing to be bound by these terms and conditions.
2. Use of the Service: Kiya Equb is a platform where users can save money and invest money. You can use Kiya Equb to create accounts, save money, invest money, and get the withdrawal safely when meeting the withdrawal conditions. You must be at least 18 years old to use Kiya Equb.
3. Kiya Equb will not charge you for the withdrawal after meeting the set conditions. 
4. You are responsible for keeping the application secure and up-to-date when updates are available.
5. You are responsible for any transactions you make through the Kiya Equb application software.
6. This Terms and Conditions of Use is effective as of any upcoming updates.
7. This Terms and Conditions can be updated at any time without prior notice so it is your responsibility to review these terms and conditions periodically.
8. If you have any questions or concerns about these terms and conditions, please contact us at support@kiyaequb.com.
last updated on June 29, 2024
`;
const or = `Ormomiffa, Kiya Equb, !
ኪያ እቁብ በኢትዮጵያ ውስጥ ካሉ ምርጥ እና ታማኝ የኦንላይን ላይ፣ በአካል እና በድብልቅ የሚሰራ እቁቦች ውስጥ አንዱ ነው።
Terms and Conditions:
1. Acceptance: By using Kiya Equb, you are agreeing to be bound by these terms and conditions.
2. Use of the Service: Kiya Equb is a platform where users can save money and invest money. You can use Kiya Equb to create accounts, save money, invest money, and get the withdrawal safely when meeting the withdrawal conditions. You must be at least 18 years old to use Kiya Equb.
3. Kiya Equb will not charge you for the withdrawal after meeting the set conditions. 
4. You are responsible for keeping the application secure and up-to-date when updates are available.
5. You are responsible for any transactions you make through the Kiya Equb application software.
6. This Terms and Conditions of Use is effective as of any upcoming updates.
7. This Terms and Conditions can be updated at any time without prior notice so it is your responsibility to review these terms and conditions periodically.
8. If you have any questions or concerns about these terms and conditions, please contact us at 0912234567.
last updated on June 29, 2024
`;

export const POST = async (request) => {
  try {
    const { lang } = await request.json();
    if (lang === "en") {
      return NextResponse.json({ terms: en });
    }
    if (lang === "am") {
      return NextResponse.json({ terms: am });
    }
    if (lang === "or") {
      return NextResponse.json({ terms: or });
    }

    return NextResponse.json({ error: "invalid language keyword!" });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "field to get terms and conditions!" },
      { status: 500 }
    );
  }
};
