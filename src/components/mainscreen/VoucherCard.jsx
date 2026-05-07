const VoucherCard = () => {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-8 flex items-center min-h-[280px] group"
      style={{ backgroundColor: "var(--secondary)" }}
    >
      {/* Background Decorative Icons */}
      <div className="absolute top-4 right-20 group-hover:scale-150 ease-linear transition">
        <img src="/calpng.png" alt="" />
      </div>
      <div className="absolute top-0 left-60 group-hover:scale-150 ease-linear transition">
        <img src="/book.png" alt="" />
      </div>
      <div className="absolute bottom-0 left-0">
        <img src="/ellipse.png" alt="" />
      </div>

      {/* Text Content */}
      <div className="relative z-10 w-2/3">
        <h2 className="text-white text-3xl font-bold leading-tight mb-4">
          Join Now and Get Discount Voucher Up To 20%
        </h2>
        <p className="text-white/80 text-sm leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt.
        </p>
      </div>

      {/* Main Image */}
      <div className="absolute bottom-0 right-2 h-full w-1/3">
        <img
          src="/egucation-girl.png"
          alt="Promotion"
          className="h-full w-full object-contain object-bottom"
        />
      </div>
    </div>
  );
};

export default VoucherCard;
