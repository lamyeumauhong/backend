const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
const CartItem = require("../models/CartModel")
dotenv.config()
var inlineBase64 = require('nodemailer-plugin-inline-base64');

const sendEmailCreateOrder = async (email,orderItems) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "vuduong31022@gmail.com", // generated ethereal user
      pass:"hmpzcdymhlixzhue" , // generated ethereal password
    },
  });
  transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));

  let listItem = '';
  const attachImage = []
  const populatedOrderItems = await CartItem.find({ _id: { $in: orderItems } })
        .populate('productId', 'name price image');
  populatedOrderItems.forEach((order) => {
    listItem += `<div>
        <div>
            Bạn đã đặt sản phẩm <b>${order.productId.name}</b> với số lượng: 
            <b>${order.quantity}</b> và giá là: <b>${order.totalPrice} VND</b>
        </div>
        <div>Bên dưới là hình ảnh của sản phẩm</div>
        <img src="cid:somePrefix_${order.productId.image}"/>
    </div>`;
    attachImage.push({ path: order.productId.image, cid: `somePrefix_${order.productId.image}` });
});

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "vuduong31022@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Bạn đã đặt hàng tại shop", // Subject line
    html: `<div><b>Bạn đã đặt hàng thành công tại shop</b></div> ${listItem}`,
    attachments: attachImage,
  });
}

module.exports = {
  sendEmailCreateOrder
}