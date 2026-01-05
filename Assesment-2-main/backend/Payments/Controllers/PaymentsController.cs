using Microsoft.AspNetCore.Mvc;

namespace Payments.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PaymentsController : ControllerBase
    {
        [HttpPost("Pay")]
        public IActionResult Pay([FromBody] PaymentRequest request)
        {
            // Basic validation
            if (request == null)
                return BadRequest("Request cannot be null");

            if (request.Amount <= 0)
                return BadRequest("Amount must be greater than zero");

            if (request.CardDetails == null || string.IsNullOrWhiteSpace(request.CardDetails.CardNumber))
                return BadRequest("Invalid card number");

            // 1. Detect card type
            var cardType = GetCardType(request.CardDetails.CardNumber);

            // 2. Calculate discount percentage
            decimal discountPercentage = cardType switch
            {
                CardType.Visa => 0,
                CardType.MasterCard => 5,
                _ => 10 // RuPay (default)
            };

            // 3. Calculate amounts
            var discountAmount = request.Amount * discountPercentage / 100;
            var finalAmount = request.Amount - discountAmount;

            // 4. Prepare response
            var response = new PaymentResponse
            {
                CardType = cardType.ToString(),
                OriginalAmount = request.Amount,
                DiscountPercentage = discountPercentage,
                DiscountAmount = discountAmount,
                FinalAmount = finalAmount
            };

            return Ok(response);
        }

        // Card type detection logic (as per assessment rules)
        private CardType GetCardType(string cardNumber)
        {
            if (cardNumber.StartsWith("4"))
                return CardType.Visa;

            if (cardNumber.StartsWith("5"))
                return CardType.MasterCard;

            if (cardNumber.StartsWith("6"))
                return CardType.RuPay;

            // Default must be RuPay
            return CardType.RuPay;
        }
    }

    // Card type enum
    public enum CardType
    {
        Visa,
        MasterCard,
        RuPay
    }
}
