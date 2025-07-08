import { errorResponse, successResponse } from '../Helpers/responses.js';
import { sendEmail } from '../Helpers/sendMail.js';
import Donation from '../Models/Donation.js';

export const makeDonation = async (req, res) => {
  try {
    const {
      name,
      email,
      chosenArea,
      transactionReference,
      amount,
      currency,
      language,
    } = req.body;
    const newDonation = new Donation({
      name: name,
      email: email,
      transactionReference: transactionReference,
      amount: amount,
      currency: currency,
      donationArea: chosenArea,
    });
    const donation = await (await newDonation.save()).populate('donationArea');
    let subject = 'CARITAS BYUMBA - DONATION RECIEVED';
    let message = `Thank you ${name}, your donation has been received successfully.`;
    let donationAreaMessage = `Your donation will be used in the following area: ${donation.donationArea.name[language]}`;
    let messageSecond = `To follow on the usage of your donation please contact us.`;
    if (language === 'fr') {
      subject = 'CARITAS BYUMBA - DON REÇU';
      message = `Merci ${name}, votre don a bien été reçu.`;
      donationAreaMessage = `Votre don sera utilisé dans le domaine suivant : ${donation.donationArea.name[language]}`;
      messageSecond = `Pour suivre l'utilisation de votre don, veuillez nous contacter.`;
    }
    if (language === 'rw') {
      subject = 'CARITAS BYUMBA - IMPANO YAKIRIWE';
      message = `Murakoze ${name}, impano yanyu yakiriwe neza.`;
      donationAreaMessage = `Inkunga yawe izakoreshwa mu gice gikurikira: ${donation.donationArea.name[language]}`;
      messageSecond = `Kugirango ukurikirane imikoreshereze yimpano yawe, twandikire.`;
    }
    await sendEmail(
      email,
      subject,
      `<div style="width: 100%;display: flex;justify-content: center;align-items: center;background-color:#751E17;">
        <div style="margin: 50px; padding: 20px; background-color: #ffffff; width: 100%;">
          <p style="text-align:center;font-size:40px;font-weight:bold;color: #751E17;">CARITAS BYUMBA</p> 
          <p style="padding:0 4px;color: #000000;color: #000000;">Hello ${name},</p>
          <p style="padding:0 4px;color: #000000;color: #000000;">${message}</p>
          <p style="padding:0 4px;color: #000000;color: #000000;">${donationAreaMessage}</p>
          <p style="padding:0 4px;color: #000000;color: #000000;">${donation.donationArea.description[language]}</p>
          <p style="padding:0 4px;color: #000000;color: #000000;">${messageSecond}</p>
          <p style="padding:0 4px;color: #000000;color: #000000;"><i>Email: caritasbyumba81@gmail.com</i></p>
          <p style="padding:0 4px;color: #000000;color: #000000;"><i>Tel: +250788476714</i></p>
          <a href="https://caritasbyumba.org/"><img src="https://api.caritasbyumba.org/images/logo-full.png" alt="" loading="lazy"></a>
        </div>
      </div>`
    );
    return successResponse(res, 200, 'Donation made successfully', donation);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
