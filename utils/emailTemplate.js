const emailTempalte = () => {
  return `
    <div style="max-width: 600px; margin: 0 auto;">

    <div> <img src="https://ibb.co/wMm7xm9" alt="" /></div>
    <div style="background-color: #3498db; color: #fff; text-align: center; padding: 20px;">
      <h1>Special Offer!</h1>
      <p>Don't miss out on our exclusive promotion.</p>
    </div>

    
    <div style="padding: 20px;">
      <h2>Featured Product</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel justo a justo laoreet dignissim.</p>

      
      <p>
        <a href="https://example.com" style="display: inline-block; padding: 10px 20px; background-color: #e74c3c; color: #fff; text-decoration: none; border-radius: 5px;">Shop Now</a>
      </p>
    </div>

    
    <div style="background-color: #f2f2f2; padding: 10px; text-align: center;">
      <p>Follow us on social media: <a href="https://facebook.com">Facebook</a> | <a href="https://twitter.com">Twitter</a></p>
    </div>

  </div>
    `;
};
module.exports = {
  emailTempalte,
};
